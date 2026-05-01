package com.ltc.NeuroHire.security;

import com.ltc.NeuroHire.common.enums.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class JwtService {

    private final JwtProperties props;

    private SecretKey key() {
        byte[] bytes = Decoders.BASE64.decode(props.getSecret());
        return Keys.hmacShaKeyFor(bytes);
    }

    public String generateAccessToken(Long userId, String email, Role role, Long companyId) {
        Date now = new Date();
        return Jwts.builder()
                .issuer(props.getIssuer())
                .subject(String.valueOf(userId))
                .claim("email", email)
                .claim("role", role.name())
                .claim("companyId", companyId)
                .issuedAt(now)
                .expiration(new Date(now.getTime() + props.getAccessExpirationMs()))
                .signWith(key())
                .compact();
    }

    public String generateRefreshToken(Long userId) {
        Date now = new Date();
        return Jwts.builder()
                .issuer(props.getIssuer())
                .subject(String.valueOf(userId))
                .claim("type", "refresh")
                .issuedAt(now)
                .expiration(new Date(now.getTime() + props.getRefreshExpirationMs()))
                .signWith(key())
                .compact();
    }

    public Claims parse(String token) {
        try {
            return Jwts.parser().verifyWith(key()).build().parseSignedClaims(token).getPayload();
        } catch (JwtException ex) {
            throw new JwtException("Invalid or expired JWT");
        }
    }

    public boolean isValid(String token) {
        try {
            parse(token);
            return true;
        } catch (Exception ex) {
            return false;
        }
    }

    public Map<String, Object> describe(String token) {
        Claims c = parse(token);
        return Map.of(
                "userId", Long.valueOf(c.getSubject()),
                "email", c.get("email", String.class),
                "role", c.get("role", String.class),
                "companyId", c.get("companyId")
        );
    }
}
