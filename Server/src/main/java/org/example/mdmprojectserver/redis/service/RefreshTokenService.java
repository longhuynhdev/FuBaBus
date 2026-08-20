package org.example.mdmprojectserver.redis.service;

import org.example.mdmprojectserver.mongodb.security.JwtProperties;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.HexFormat;

/**
 * Server-side refresh tokens, held in Redis so they can be revoked immediately.
 *
 * <p>Tokens are opaque random strings, not JWTs — a stateless refresh token could not be
 * revoked, which would defeat the purpose. Only a SHA-256 hash of the token is stored, so a
 * dump of Redis does not hand out usable credentials. Redis' own TTL expires them.
 *
 * <p>Every successful refresh rotates the token: the old one is deleted as it is read, so a
 * stolen token stops working the moment the legitimate client refreshes.
 */
@Service
public class RefreshTokenService {

    private static final String KEY_PREFIX = "refresh:";
    private static final int TOKEN_BYTES = 32;

    private final StringRedisTemplate redisTemplate;
    private final JwtProperties jwtProperties;
    private final SecureRandom secureRandom = new SecureRandom();

    public RefreshTokenService(StringRedisTemplate redisTemplate, JwtProperties jwtProperties) {
        this.redisTemplate = redisTemplate;
        this.jwtProperties = jwtProperties;
    }

    /** Issues a new refresh token bound to the given customer. */
    public String issue(String customerId) {
        byte[] bytes = new byte[TOKEN_BYTES];
        secureRandom.nextBytes(bytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);

        redisTemplate.opsForValue().set(key(token), customerId, jwtProperties.getRefreshTokenTtl());
        return token;
    }

    /**
     * Atomically validates and consumes a refresh token, returning the customer id it was
     * issued to, or {@code null} if it is unknown, already used, or expired.
     */
    public String consume(String token) {
        if (token == null || token.isBlank()) {
            return null;
        }
        return redisTemplate.opsForValue().getAndDelete(key(token));
    }

    /** Revokes a refresh token; a no-op if it is already gone. */
    public void revoke(String token) {
        if (token != null && !token.isBlank()) {
            redisTemplate.delete(key(token));
        }
    }

    private String key(String token) {
        return KEY_PREFIX + sha256(token);
    }

    private static String sha256(String value) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                    .digest(value.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 is not available", e);
        }
    }
}
