package com.wandrr.security;

import com.wandrr.modules.user.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.refresh-secret}")
    private String refreshSecret;

    @Value("${jwt.access-token-expiry}")
    private long accessTokenExpiry;

    @Value("${jwt.refresh-token-expiry}")
    private long refreshTokenExpiry;

    @Value("${jwt.reset-token-expiry}")
    private long resetTokenExpiry;

    public String generateAccessToken(User user) {
        return buildToken(user.getId().toString(), user.getEmail(),
                user.getRole().name(), accessTokenExpiry, jwtSecret);
    }

    public String generateRefreshToken(User user) {
        return buildToken(user.getId().toString(), user.getEmail(),
                null, refreshTokenExpiry, refreshSecret);
    }

    public String generateResetToken(String email) {
        return Jwts.builder()
                .subject(email)
                .claim("purpose", "password_reset")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + resetTokenExpiry))
                .signWith(getSigningKey(jwtSecret))
                .compact();
    }

    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject, jwtSecret);
    }

    public String extractEmailFromResetToken(String token) {
        return extractClaim(token, Claims::getSubject, jwtSecret);
    }

    public String extractEmailFromRefreshToken(String token) {
        return extractClaim(token, Claims::getSubject, refreshSecret);
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String email = extractEmail(token);
        return email.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    private String buildToken(String userId, String email, String role,
            long expiry, String secret) {
        Map<String, Object> claims = new HashMap<>();
        if (role != null)
            claims.put("role", role);
        claims.put("userId", userId);

        return Jwts.builder()
                .claims(claims)
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiry))
                .signWith(getSigningKey(secret))
                .compact();
    }

    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration, jwtSecret).before(new Date());
    }

    private <T> T extractClaim(String token, Function<Claims, T> resolver, String secret) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey(secret))
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return resolver.apply(claims);
    }

    private SecretKey getSigningKey(String secret) {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
