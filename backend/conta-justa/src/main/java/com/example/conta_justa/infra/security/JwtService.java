package com.example.conta_justa.infra.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

/**
 * JwtService
 */
@Service
public class JwtService {

  private final SecretKey secretKey;
  private final long expiration;

  public JwtService(
    @Value("${app.jwt.secret}") String secret,
    @Value("${app.jwt.expiration}") long expiration
  ) {
    this.secretKey = Keys.hmacShaKeyFor(
      secret.getBytes(StandardCharsets.UTF_8)
    );
    this.expiration = expiration;
  }

  public String generateToken(String email) {
    Date now = new Date();
    return Jwts.builder()
      .subject(email)
      .issuedAt(now)
      .expiration(new Date(now.getTime() + expiration))
      .signWith(secretKey)
      .compact();
  }

  public String extractEmail(String token) {
    return Jwts.parser()
      .verifyWith(secretKey)
      .build()
      .parseSignedClaims(token)
      .getPayload()
      .getSubject();
  }

  public boolean isValid(String token, UserDetails user) {
    String email = extractEmail(token);
    return email.equals(user.getUsername());
  }
}
