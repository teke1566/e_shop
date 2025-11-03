package com.eshop.auth_service.security;


import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Base64;
import java.util.Date;
import org.springframework.stereotype.Component;

import java.security.Key;

@Component
public class JwtTokenProvider {
    private String jwtSecret = "VGhpcyBpcyB0aGUgSldUIHNlY3JldCBrZXkgZm9yIGltcGxlbWVudGluZyBqd3QgdG9rZW4gc3lzdGVtIGluIGF1dGhnIHNlcnZpY2U=";
    private Long jwtExpirationInMs = 604800L;

    // generate token
    public String generateToken(Authentication authentication) {
        org.springframework.security.core.userdetails.User userDetails =
                (org.springframework.security.core.userdetails.User) authentication.getPrincipal();

        String username = userDetails.getUsername();
        String role = userDetails.getAuthorities().iterator().next().getAuthority();

        Date currentDate = new Date();
        Date expiryDate = new Date(currentDate.getTime() + jwtExpirationInMs);

        return Jwts.builder()
                .subject(username)
                .claim("role", role) // include role
                .issuedAt(currentDate)
                .expiration(expiryDate)
                .signWith(key())
                .compact();
    }

    // encode the key
    private Key key(){
        return Keys.hmacShaKeyFor(Decoders.BASE64URL.decode(jwtSecret));
    }

    // get username from jwt token
    public String getUsername(String token){
        return Jwts.parser()
                .verifyWith((SecretKey) key())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    // validate jwt token
    /**
     * token expired
     * invalid token
     * unsupported token
     * jwt claim is null or empty
     *
     */
    public boolean validateToken(String token){
        try {
            Jwts.parser()
                    .verifyWith((SecretKey) key())
                    .build()
                    .parse(token);
            return true;
        }catch (MalformedJwtException ex) {
            throw new RuntimeException("Invalid JWT token");
        }catch (ExpiredJwtException ex) {
            throw new RuntimeException("Expired JWT token");
        }catch (IllegalArgumentException ex) {
            throw new RuntimeException("JWT claims string is empty.");
        }catch (UnsupportedJwtException ex) {
            throw new RuntimeException("JWT token is unsupported");
        }catch (Exception ex){
            throw new RuntimeException("JWT token validation failed");
        }
    }
}
