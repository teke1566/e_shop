package com.eshop.api_gateway.utils;


import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;


import java.security.Key;

@Component
public class JwtUtil {
    private String jwtSecret = "VGhpcyBpcyB0aGUgSldUIHNlY3JldCBrZXkgZm9yIGltcGxlbWVudGluZyBqd3QgdG9rZW4gc3lzdGVtIGluIGF1dGhnIHNlcnZpY2U=";
    private long jwtExpirationInMs = 604800L; // 7 days

    public void validateToken(final String token){
        Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token);
    }

    private Key getSigningKey() {
        // standard Base64 (NOT Base64URL)
        byte[] keyBytes = io.jsonwebtoken.io.Decoders.BASE64.decode(jwtSecret);
        return io.jsonwebtoken.security.Keys.hmacShaKeyFor(keyBytes);
    }

}