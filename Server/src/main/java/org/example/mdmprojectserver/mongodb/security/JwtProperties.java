package org.example.mdmprojectserver.mongodb.security;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.time.Duration;

/**
 * Token lifetimes, overridable with {@code app.jwt.access-token-ttl} /
 * {@code app.jwt.refresh-token-ttl}.
 *
 * <p>The access token is deliberately short-lived: authorities are read straight from its
 * {@code role} claim without touching the database, so its lifetime is also the window in
 * which a revoked or demoted user keeps their old access. The refresh token is the part
 * that is revocable at any moment — it lives in Redis and is checked against the customer
 * record on every use.
 */
@Data
@ConfigurationProperties(prefix = "app.jwt")
public class JwtProperties {

    private Duration accessTokenTtl = Duration.ofMinutes(15);

    private Duration refreshTokenTtl = Duration.ofDays(7);
}
