package com.mealmaster.backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import com.mealmaster.backend.entity.User;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier", user.getId().toString())
                .claim("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress", user.getEmail())
                .claim("http://schemas.microsoft.com/ws/2008/06/identity/claims/role", user.getRole().toString())
                .claim("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name", user.getName())
                .claim("city", user.getCity())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }

    public String getEmailFromToken(String token) {
        return getClaimsFromToken(token).getSubject();
    }

    public boolean isTokenExpired(String token) {
        return getClaimsFromToken(token).getExpiration().before(new Date());
    }

    public boolean validateToken(String token, String email) {
        return email.equals(getEmailFromToken(token)) && !isTokenExpired(token);
    }

    private Claims getClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}