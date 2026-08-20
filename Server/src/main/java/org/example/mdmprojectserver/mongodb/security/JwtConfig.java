package org.example.mdmprojectserver.mongodb.security;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

/**
 * The HMAC key and the encoder/decoder pair used to sign and verify access tokens.
 */
@Configuration
@EnableConfigurationProperties(JwtProperties.class)
public class JwtConfig {

    private static final Logger log = LoggerFactory.getLogger(JwtConfig.class);

    private static final String HMAC_ALGORITHM = "HmacSHA512";

    /** HS512 requires a key of at least 512 bits. */
    private static final int MIN_KEY_LENGTH_BYTES = 64;

    @Bean
    public SecretKey jwtSecretKey(@Value("${JWT_SECRET:}") String jwtSecret) {
        if (jwtSecret == null || jwtSecret.isBlank()) {
            log.warn("JWT_SECRET is not set — generating a random signing key. Tokens issued "
                    + "before a restart will stop being accepted, and multiple instances will "
                    + "not accept each other's tokens. Set JWT_SECRET outside development.");
            return generateKey();
        }

        byte[] keyBytes = Base64.getDecoder().decode(jwtSecret);
        if (keyBytes.length < MIN_KEY_LENGTH_BYTES) {
            throw new IllegalStateException(
                    "JWT_SECRET decodes to %d bytes, but HS512 needs at least %d. Generate one with: openssl rand -base64 64"
                            .formatted(keyBytes.length, MIN_KEY_LENGTH_BYTES));
        }
        return new SecretKeySpec(keyBytes, HMAC_ALGORITHM);
    }

    @Bean
    public JwtEncoder jwtEncoder(SecretKey jwtSecretKey) {
        return new NimbusJwtEncoder(new ImmutableSecret<>(jwtSecretKey));
    }

    @Bean
    public JwtDecoder jwtDecoder(SecretKey jwtSecretKey) {
        return NimbusJwtDecoder.withSecretKey(jwtSecretKey)
                .macAlgorithm(MacAlgorithm.HS512)
                .build();
    }

    private static SecretKey generateKey() {
        try {
            return KeyGenerator.getInstance(HMAC_ALGORITHM).generateKey();
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("%s is not available".formatted(HMAC_ALGORITHM), e);
        }
    }
}
