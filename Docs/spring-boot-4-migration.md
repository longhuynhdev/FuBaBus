# Spring Boot 4 Migration — Server

Upgrade of `Server/` from **Spring Boot 3.5.11 → 4.1.0**, with the JWT and OpenAPI
libraries moved to their Boot 4 compatible lines.

Java stays at **25** (Boot 4's baseline is 17, so no toolchain change was needed).

---

## 1. Version changes

| Dependency | Before | After | Notes |
|---|---|---|---|
| `spring-boot-starter-parent` | 3.5.11 | **4.1.0** | Pulls Spring Framework 7.0.8, Spring Security 7.1.0, Spring Data MongoDB 5.1.0, Spring Data Redis 4.1.0 |
| `springdoc-openapi-starter-webmvc-ui` | 2.3.0 | **3.1.0** | springdoc 3.x is the Boot 4 line (3.1.0 is itself built against Boot 4.1.0); the 2.x line targets Boot 3 |
| `jjwt-api` / `-impl` / `-jackson` | 0.11.5 | **0.13.0** | Now versioned from a single `${jjwt.version}` property |
| `lombok` | 1.18.42 (pinned) | **1.18.46** (managed) | Version dropped; inherited from `spring-boot-dependencies` |
| `swagger-annotations-jakarta` | 2.2.19 (explicit) | **removed** | Arrives transitively at 2.2.52 via springdoc |
| `spring-boot-starter-validation` | *(absent)* | **added** | See §2.6 |
| Jackson | 2.x only | **3.1.4** (`tools.jackson`) + 2.21.4 | See §2.4 |
| MongoDB driver | 5.x | 5.8.0 | |
| Jedis / Lettuce | — | 7.4.1 / 7.5.2 | Both present; see §4.2 |

---

## 2. Breaking changes encountered

### 2.1 `spring.data.mongodb.*` connection properties were removed — silent failure

**The most dangerous change in this upgrade.** Boot 4.0 moved every MongoDB *connection*
property from `spring.data.mongodb.*` to `spring.mongodb.*`. The old keys are not
deprecated-but-working — their metadata deprecation level is `error`, meaning they are no
longer bound at all.

Nothing fails at startup. The keys are simply ignored, the driver falls back to its
defaults (`localhost:27017`, no credentials), and the app dies later on the first query:

```
com.mongodb.MongoQueryException: Command execution failed on MongoDB server with
error 13 (Unauthorized): 'Command find requires authentication'
```

Renamed in `application-dev.properties` and `application-prod.properties`:

```diff
-spring.data.mongodb.authentication-database=admin
-spring.data.mongodb.username=mongo
-spring.data.mongodb.password=mongo
-spring.data.mongodb.host=localhost
-spring.data.mongodb.port=27017
-spring.data.mongodb.database=FuBaBus
+spring.mongodb.authentication-database=admin
+spring.mongodb.username=mongo
+spring.mongodb.password=mongo
+spring.mongodb.host=localhost
+spring.mongodb.port=27017
+spring.mongodb.database=FuBaBus
```

Full mapping of the affected keys:

| Removed (Boot 3) | Replacement (Boot 4) |
|---|---|
| `spring.data.mongodb.uri` | `spring.mongodb.uri` |
| `spring.data.mongodb.host` / `.port` / `.protocol` | `spring.mongodb.host` / `.port` / `.protocol` |
| `spring.data.mongodb.username` / `.password` | `spring.mongodb.username` / `.password` |
| `spring.data.mongodb.authentication-database` | `spring.mongodb.authentication-database` |
| `spring.data.mongodb.database` | `spring.mongodb.database` |
| `spring.data.mongodb.replica-set-name` | `spring.mongodb.replica-set-name` |
| `spring.data.mongodb.additional-hosts` | `spring.mongodb.additional-hosts` |
| `spring.data.mongodb.ssl.*` | `spring.mongodb.ssl.*` |
| `spring.data.mongodb.uuid-representation` | `spring.mongodb.representation.uuid` |

Spring-Data-specific keys (`spring.data.mongodb.auto-index-creation`, `.gridfs.*`,
`.repositories.type`, `.representation.big-decimal`) keep the `spring.data.mongodb`
prefix — only the driver/connection half moved.

> **Redis was not affected**: `spring.data.redis.*` is unchanged in Boot 4.

### 2.2 Auto-configuration classes moved out of `spring-boot-autoconfigure`

Boot 4 split the monolithic `spring-boot-autoconfigure` jar into per-technology modules,
relocating (and sometimes renaming) the auto-configuration classes. This bites in two
places.

**a) `spring.autoconfigure.exclude` in `application.properties`** — an unresolvable class
name here **fails startup**:

```diff
-spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.data.redis.RedisRepositoriesAutoConfiguration
+spring.autoconfigure.exclude=org.springframework.boot.data.redis.autoconfigure.DataRedisRepositoriesAutoConfiguration
```

Note both the new package *and* the new `Data…` class-name prefix.

**b) `@SpringBootApplication(exclude = …)` in `Application.java`** — a hard compile error,
since the classes are no longer on the classpath at all:

```
package org.springframework.boot.autoconfigure.jdbc does not exist
package org.springframework.boot.autoconfigure.orm.jpa does not exist
```

The excludes were dropped entirely rather than repointed: this project has no JDBC or JPA
dependency, so those auto-configurations were never active and there is nothing to
exclude.

```diff
-@SpringBootApplication(exclude = {
-    org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration.class,
-    org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration.class
-})
+@SpringBootApplication
```

General rule for this restructure: `org.springframework.boot.autoconfigure.<tech>.XAutoConfiguration`
is now `org.springframework.boot.<tech>.autoconfigure.XAutoConfiguration`.

### 2.3 JJWT 0.11 → 0.13: the whole builder/parser API was replaced

The 0.11 setter-style API was removed in 0.12. `JWTGenerator` failed to compile with
`cannot find symbol: method parserBuilder()`.

| jjwt 0.11 | jjwt 0.12+ |
|---|---|
| `Jwts.parserBuilder()` | `Jwts.parser()` |
| `.setSigningKey(key)` | `.verifyWith(key)` (needs `SecretKey`, not `Key`) |
| `.parseClaimsJws(token)` | `.parseSignedClaims(token)` |
| `.getBody()` | `.getPayload()` |
| `.setSubject()` / `.setIssuedAt()` / `.setExpiration()` | `.subject()` / `.issuedAt()` / `.expiration()` |
| `SignatureAlgorithm.HS512` | `Jwts.SIG.HS512` |
| `Keys.secretKeyFor(SignatureAlgorithm.HS512)` | `Jwts.SIG.HS512.key().build()` |

The field type also had to change from `java.security.Key` to `javax.crypto.SecretKey` —
`verifyWith` and the MAC overload of `signWith` no longer accept the broader `Key`.

Token format is unchanged, so **existing issued tokens remain valid** (verified: HS512
tokens still round-trip).

### 2.4 Jackson 3 is the default

Spring Boot 4 ships **Jackson 3** (`tools.jackson.*`, 3.1.4). Jackson 2
(`com.fasterxml.jackson.*`) is still version-managed at 2.21.4 but is no longer on the
classpath by default.

`BookingService` imported the Jackson 2 `ObjectMapper` and only kept compiling by accident
— Jackson 2 was reaching the classpath transitively through `jjwt-jackson`. Migrated to
Jackson 3, and switched from `new ObjectMapper()` to the Boot-managed bean so the Redis
payloads use the same configuration as the HTTP layer:

```diff
-import com.fasterxml.jackson.databind.ObjectMapper;
+import tools.jackson.databind.ObjectMapper;

-ObjectMapper objectMapper = new ObjectMapper();
-String ticketJson = objectMapper.writeValueAsString(ticket);
+String ticketJson = objectMapper.writeValueAsString(ticket);   // injected via constructor
```

Note for future work: Jackson 3 throws **unchecked** `JacksonException` instead of the
checked `JsonProcessingException`, so `throws` clauses that only existed for Jackson are
now removable.

### 2.5 `jjwt-bom` silently downgrades `jackson-databind` — do not import it

Versioning the three jjwt modules through `io.jsonwebtoken:jjwt-bom` looks like the tidy
option, but it **pins `jackson-databind` to 2.12.7.1** (a 2022 release). A BOM imported in
this POM outranks the `jackson-2-bom` that `spring-boot-dependencies` imports, so it
downgraded `jackson-databind` build-wide while `jackson-core` and `jackson-annotations`
stayed at 2.21.4 — a split-version Jackson 2, affecting `swagger-core-jakarta` (which
wanted 2.21.1) as much as jjwt:

```
com.fasterxml.jackson.core:jackson-databind:jar:2.12.7.1 (version managed from 2.21.1)
```

The BOM import was removed and each jjwt module versioned from `${jjwt.version}` instead,
which restores `jackson-databind` to Boot's managed 2.21.4. A comment in `pom.xml` records
this so the BOM does not get reintroduced.

### 2.6 Bean Validation was only present by accident

`@Valid`, `@NotEmpty` and `@Pattern` are used across the DTOs and controllers, but
`spring-boot-starter-validation` was never declared — `hibernate-validator` was arriving
transitively through springdoc. That is fragile in either Boot version, and a springdoc
upgrade could silently disable all request validation.

Added explicitly:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

### 2.7 Removed / deprecated APIs

| API | Status | Fix |
|---|---|---|
| `CachingConfigurerSupport` | Deprecated since Spring 6.0 | Dropped `extends CachingConfigurerSupport` from `RedisConfig` — it overrode nothing |
| `ValueOperations.set(K,V,long,TimeUnit)` | Deprecated in Spring Data Redis 4 | `ops.set(key, json, Duration.ofSeconds(30))` |
| `@Indexed(background = true)` | Deprecated **and marked for removal** in Spring Data MongoDB 5 | Dropped the attribute in `Customer` — MongoDB ≥ 4.2 builds indexes this way regardless |

The build now compiles with **zero deprecation warnings**.

---

## 3. Verification performed

Build: `./mvnw clean verify` — compiles clean, `contextLoads` passes, jar builds.

The app was then started against real MongoDB and Redis containers and exercised
end-to-end:

| Check | Result |
|---|---|
| Application starts | Started in 4.4 s on Boot 4.1.0 |
| `GET /v3/api-docs` | 200, OpenAPI 3.1.0 document (springdoc 3.1.0) |
| `GET /swagger-ui/index.html` | 200 |
| `POST /api/auth/register` | 200, customer persisted |
| Bean Validation rejects a bad phone number | Rejected with the constraint message |
| `POST /api/auth/login` | 200, HS512 JWT issued by jjwt 0.13.0 |
| Authenticated request with Bearer token | 200 |
| Request with an invalid token | 401 |
| Unauthenticated request to a protected route | 401 |
| `POST /api/buses` as ADMIN (role check) | 200, bus + seats created |
| `POST /api/bookings` (Jackson 3 → Redis) | 200, key written with 30 s TTL |
| `POST /api/bookings/confirmation` (Redis → Jackson 3) | 200, ticket + invoice persisted |
| `KeyExpirationListener` on TTL expiry | Fired; seat reverted `isBooked: true → false`, `customerId` cleared |

Test data created during verification was removed from the `FuBaBus` database afterwards.

---

## 4. Suggested follow-ups (not applied)

These are pre-existing issues surfaced during the upgrade, left alone to keep the diff
scoped to the migration.

### 4.1 Replace JJWT with Spring Security's built-in JWT support

Spring Security has shipped first-class JWT encoding/decoding since 5.2 — `JwtEncoder` /
`JwtDecoder` backed by Nimbus, configured through
`spring-boot-starter-oauth2-resource-server`. Adopting it would:

- drop the `jjwt-api` / `-impl` / `-jackson` trio entirely;
- **remove Jackson 2 from the classpath**, since `jjwt-jackson` is the only thing pulling
  it in (see §2.4) — jjwt has no Jackson 3 module yet;
- replace the hand-rolled `JWTAuthenticationFilter` with the framework's
  `BearerTokenAuthenticationFilter`, which also handles error responses per RFC 6750.

This is the single highest-value cleanup available, but it is a real refactor of
`JWTGenerator`, `JWTAuthenticationFilter` and `SecurityConfig`, so it belongs in its own
change. If you would rather keep JJWT, swapping `jjwt-jackson` for `jjwt-gson` also gets
Jackson 2 off the classpath at a much lower cost.

### 4.2 Both Jedis and Lettuce are on the classpath

`spring-boot-starter-data-redis` brings **Lettuce** (Boot's default client), while
`RedisConfig` hand-builds a `JedisConnectionFactory` from `@Value`-injected properties —
so Lettuce is dead weight and the manual factory duplicates what Boot auto-configures from
`spring.data.redis.*`.

Deleting `RedisConfig` entirely would let Boot auto-configure the connection factory,
`StringRedisTemplate` and `RedisTemplate` from the same properties. Worth noting that the
custom `RedisTemplate<String, Object>` bean it declares appears unused — the code injects
`StringRedisTemplate` (in `BookingService`) and `RedisTemplate<String, String>` (in
`KeyExpirationListener`, where the field is never read).

If Jedis is a deliberate choice, set `spring.data.redis.client-type=jedis` and exclude
`lettuce-core` instead of configuring the factory by hand.

### 4.3 `spring-boot-starter-cache` is unused

No `@EnableCaching` or `@Cacheable` anywhere in the codebase. The starter can be removed
until caching is actually adopted.

### 4.4 CORS preflight returns 401 (pre-existing, **not** an upgrade regression)

`OPTIONS /api/buses` with `Origin: http://localhost:5173` returns **401**. This was
confirmed to behave identically on Boot 3.5.11, so the upgrade did not cause it.

The cause is that `WebConfig` registers CORS mappings at the MVC layer, but `SecurityConfig`
never calls `http.cors(...)`. The Spring Security filter chain therefore rejects the
unauthenticated preflight before MVC's CORS handling runs. The fix is one line in
`SecurityConfig`:

```java
http.cors(Customizer.withDefaults())
```

Worth doing if the browser client ever sends a preflight (any request with a custom header
such as `Authorization`, or a non-simple content type).

### 4.5 Validation errors surface as HTTP 500

A `@Pattern` violation on `POST /api/auth/register` returns:

```json
{"status":500,"error":"register.registerDto.phone: Invalid phone number, ..."}
```

The class-level `@Validated` on the controllers turns these into method-validation
`ConstraintViolationException`s, which bypass the `BindingResult` branch in
`AuthController.register` and fall through `GlobalExceptionHandler` as a 500. A client
error should be a 400. Also pre-existing, and independent of the upgrade.

---

## 5. Files changed

```
Server/pom.xml
Server/src/main/java/org/example/mdmprojectserver/Application.java
Server/src/main/java/org/example/mdmprojectserver/mongodb/model/Customer.java
Server/src/main/java/org/example/mdmprojectserver/mongodb/security/JWTGenerator.java
Server/src/main/java/org/example/mdmprojectserver/redis/config/RedisConfig.java
Server/src/main/java/org/example/mdmprojectserver/redis/service/BookingService.java
Server/src/main/resources/application.properties
Server/src/main/resources/application-dev.properties
Server/src/main/resources/application-prod.properties
```

No changes were needed to `Dockerfile` or `docker-compose.yml` — both already target
JDK 25, which Boot 4 supports.
