package org.example.mdmprojectserver.mongodb.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;

@Component
public class JWTGenerator {
    private final SecretKey key;

    public JWTGenerator(@Value("${JWT_SECRET:}") String jwtSecret) {
        if (jwtSecret != null && !jwtSecret.isBlank()) {
            this.key = Keys.hmacShaKeyFor(Base64.getDecoder().decode(jwtSecret));
        } else {
            this.key = Jwts.SIG.HS512.key().build();
        }
    }

    public String generateToken(Authentication authentication, String role) {
        String username = authentication.getName();
        Date currentDate = new Date();
        Date expiryDate = new Date(currentDate.getTime() + 86400000);
        String token = Jwts.builder()
                .subject(username)
                .claim("role", role)
                .issuedAt(currentDate)
                .expiration(expiryDate)
                .signWith(key, Jwts.SIG.HS512)
                .compact();
        return token;
    }

    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts
                    .parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            throw new AuthenticationCredentialsNotFoundException("Expired or invalid JWT token");
        }

    }
}
