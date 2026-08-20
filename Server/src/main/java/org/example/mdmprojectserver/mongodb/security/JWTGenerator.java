package org.example.mdmprojectserver.mongodb.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Component;

import java.time.Instant;

/**
 * Issues the short-lived access tokens handed out by {@code /api/auth/login} and
 * {@code /api/auth/refresh}.
 *
 * <p>Verification is not done here: incoming tokens are validated by Spring Security's
 * resource-server filter chain, configured in {@link SecurityConfig}.
 */
@Component
public class JWTGenerator {

    private final JwtEncoder jwtEncoder;
    private final JwtProperties jwtProperties;

    public JWTGenerator(JwtEncoder jwtEncoder, JwtProperties jwtProperties) {
        this.jwtEncoder = jwtEncoder;
        this.jwtProperties = jwtProperties;
    }

    public String generateToken(Authentication authentication, String role) {
        return generateToken(authentication.getName(), role);
    }

    public String generateToken(String subject, String role) {
        Instant now = Instant.now();

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .subject(subject)
                .claim("role", role)
                .issuedAt(now)
                .expiresAt(now.plus(jwtProperties.getAccessTokenTtl()))
                .build();

        JwsHeader header = JwsHeader.with(MacAlgorithm.HS512).build();

        return jwtEncoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
    }
}
