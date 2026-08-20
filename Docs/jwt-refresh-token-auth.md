# JWT auth rework: Spring Security tokens + refresh flow

Replaces JJWT and the hand-rolled `JWTAuthenticationFilter` with Spring Security's built-in
JWT support, and splits the single 24-hour token into a **short-lived access token** plus a
**revocable refresh token**.

Follow-up to the [Spring Boot 4 migration](./spring-boot-4-migration.md).

---

## 1. Why both halves were needed

The textbook resource-server model reads authorities straight from the token's claims and
never touches the database. That is only safe because access tokens are short-lived — the
short lifetime *is* the revocation mechanism.

The previous setup had a 24-hour token and no refresh endpoint. Reading authorities from
the claim in that configuration would have taken the stateless half of the pattern without
the part that makes it safe: a banned ADMIN would have kept their privileges for a full
day. So the TTL cut and the refresh endpoint are not optional extras here — they are what
makes claim-based authorities defensible.

| | Before | After |
|---|---|---|
| Access token TTL | 24 hours | **15 minutes** |
| Authorities from | Mongo lookup on every request | `role` claim (no DB hit) |
| Refresh token | none | **opaque, 7 days, stored in Redis** |
| Revocation | immediate (DB read per request) | refresh revoked instantly; access token valid ≤ 15 min |
| Token library | jjwt 0.13.0 | Spring Security + Nimbus |
| Bearer parsing | hand-rolled `OncePerRequestFilter` | `BearerTokenAuthenticationFilter` |

## 2. Design

### Access token — JWT, 15 minutes

Signed HS512 by `NimbusJwtEncoder`, carrying `sub` (phone) and `role`.
`RoleClaimJwtAuthenticationConverter` maps the `role` claim to a single `ROLE_*` authority.
No database access on the request path.

### Refresh token — opaque, 7 days, in Redis

Deliberately **not** a JWT: a stateless refresh token could not be revoked, which would
defeat the purpose. It is 32 bytes of `SecureRandom`, Base64URL-encoded.

Redis stores only a **SHA-256 hash** of the token as the key (`refresh:<sha256>`), with the
customer id as the value and Redis' own TTL for expiry. A dump of Redis therefore yields no
usable credentials.

**Rotation:** every refresh consumes the old token via `GETDEL` and issues a new one, so a
stolen token stops working as soon as the legitimate client refreshes.

**Re-validation:** `/refresh` re-reads the customer and checks `active`, so a deactivated or
deleted account cannot refresh. That is what bounds the blast radius to one access-token
lifetime.

### Endpoints

| Endpoint | Behaviour |
|---|---|
| `POST /api/auth/login` | Returns `accessToken` + `refreshToken` (plus `customerId`, `role`) |
| `POST /api/auth/refresh` | `{refreshToken}` → new access token + rotated refresh token; 401 if unknown, used, expired, or the account is inactive |
| `POST /api/auth/logout` | `{refreshToken}` → 204, token revoked |

Lifetimes are configurable:

```properties
app.jwt.access-token-ttl=15m
app.jwt.refresh-token-ttl=7d
```

## 3. Server changes

**Added**
- `mongodb/security/JwtConfig.java` — the `SecretKey`, `JwtEncoder` and `JwtDecoder` beans.
- `mongodb/security/JwtProperties.java` — the two TTLs.
- `mongodb/security/RoleClaimJwtAuthenticationConverter.java` — `role` claim → authority.
- `redis/service/RefreshTokenService.java` — issue / consume / revoke.
- `mongodb/dto/RefreshRequestDto.java`.

**Removed**
- `mongodb/security/JWTAuthenticationFilter.java` — superseded by
  `BearerTokenAuthenticationFilter`.
- The `jjwt-api` / `-impl` / `-jackson` dependencies.

**Changed**
- `JWTGenerator` — now only *issues* access tokens; verification belongs to the filter chain.
- `SecurityConfig` — `.oauth2ResourceServer(oauth2 -> oauth2.jwt(...))` replaces
  `addFilterBefore(...)`.
- `AuthController` — `/refresh` and `/logout`; login also returns a refresh token.
- `AuthResponseDto` — gained `refreshToken`.
- `CustomUserDetailsService` — now honours `customer.active`; previously deactivation had
  **no effect on authentication at all**.
- `GlobalExceptionHandler` — catches `AuthenticationException` rather than just
  `BadCredentialsException`/`UsernameNotFoundException`. `DisabledException` was falling
  through to the generic handler and returning **500** instead of 401.
- `KeyExpirationListener` — ignores `refresh:*` keys, which share the Redis database but
  release no seats.
- `WebConfig` / `SecurityConfig` — CORS is now a shared `CorsConfigurationSource` bean that
  the security filter chain also honours, so preflights no longer 401. This blocked the
  browser client outright once it started calling `/api/auth/refresh`.
- The four controllers annotated `@Validated` — annotation removed so validation failures
  return 400 instead of 500. See §4.5 of the migration doc.

### Note on key material

`JwtConfig` logs a warning and generates a random key when `JWT_SECRET` is unset (fine for
dev — tokens then die on restart and multiple instances reject each other's tokens). When
set, it must decode to **at least 64 bytes** for HS512; a shorter value fails fast at
startup with an explicit message rather than at first signing.

```
openssl rand -base64 64
```

`JWT_SECRET` was never wired into the production setup, so a deployed container would have
generated a fresh random key on every start and logged all users out on each redeploy. It
is now declared in `.env.example` and passed through in `docker-compose.yml`.

## 4. Client changes

The access-token TTL drop is client-visible: without refresh support the app would have
started 401-ing 15 minutes after login.

- `lib/api.ts` — `apiFetch` retries once through `/api/auth/refresh` on a 401 and replays
  the original request. Concurrent 401s share a single in-flight refresh, because rotation
  means parallel refreshes would invalidate each other. Requests to `/api/auth/*` are
  excluded, since a 401 there is a real failure. Adds `setTokens`, `clearTokens` and
  `revokeSession`.
- `components/auth/login-form.tsx` — stores both tokens via `setTokens`.
- `components/layout/header.tsx`, `components/user/menu-group.tsx` — logout now calls
  `revokeSession()` so the refresh token is revoked server-side, not just dropped locally.

## 5. Verification

`./mvnw clean verify` passes; `bun run build` type-checks and builds. The app was run
against real MongoDB and Redis:

| Check | Result |
|---|---|
| Login returns both tokens | ✅ access + refresh |
| Access token TTL | ✅ exactly 15 min (`exp - iat`) |
| Claims | ✅ `{sub, role, iat, exp}` |
| ADMIN route authorised from the `role` claim | ✅ 200, no DB lookup |
| Redis stores a hash, not the token | ✅ key is `refresh:<sha256>`; raw token not present |
| Refresh TTL | ✅ ~604800 s (7 d) |
| Refresh rotates the token | ✅ new refresh token returned |
| Replaying the consumed refresh token | ✅ 401 |
| New access token works | ✅ 200 |
| Logout | ✅ 204, then refresh → 401 |
| Deactivated account: refresh | ✅ 401 |
| Deactivated account: login | ✅ 401 (was 500 before the handler fix) |
| Wrong password / unknown user / disabled | ✅ all 401, identical body — no account enumeration |
| Missing or malformed bearer token | ✅ 401 |
| Existing access token after deactivation | ⚠️ still 200 until `exp` — the documented ≤15 min window |
| Booking flow + seat release on TTL expiry | ✅ unchanged |
| `refresh:*` keys ignored by `KeyExpirationListener` | ✅ 0 spurious handlings |
| Swagger UI / OpenAPI | ✅ 200 |
| CORS preflight from an allowed origin | ✅ 200 + `Access-Control-Allow-*` headers |
| CORS preflight from an unknown origin | ✅ 403, no headers leaked |
| Request-body validation failures | ✅ 400 across register / login / refresh / bookings |
| `JWT_SECRET` shorter than 64 bytes | ✅ startup fails with an explicit message |
| `JWT_SECRET` set correctly | ✅ starts with no warning, tokens survive restart |

Test data was removed afterwards.

## 6. Known gaps

- **One refresh token per login, no session index.** Logout revokes the token in hand, not
  every session for that customer. "Log out everywhere" would need a `customer:<id>` set of
  active token hashes.
- **Refresh tokens live in `localStorage`**, so they are readable by any XSS on the origin.
  The stronger option is an `HttpOnly; Secure; SameSite` cookie for the refresh token,
  which also needs CSRF protection on `/api/auth/refresh`.
- **Rotation detects replay but does not react to it.** A consumed token is simply refused;
  the OAuth 2.0 BCP suggests treating replay as theft and revoking the whole family.
