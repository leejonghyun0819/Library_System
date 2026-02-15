package com.example.libraryprojectdemo.domain.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Date;

@Component
public class JwtProvider {  // yml 파일에 있는 시크릿키 가져와서 등록, jwt 발급 및 인증
    private final SecretKey secretKey;
    private final long accessExpSec;
    public JwtProvider(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.access-exp-seconds:1800}") long accessExpSec) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes()); // byte 로 읽어와서 hash 후 저장
        this.accessExpSec = accessExpSec;
    }

    // jwt access token 생성
    public String createAccessToken(Long userId, String username) {
        Instant now = Instant.now();
        Instant exp = now.plusSeconds(accessExpSec);

        return Jwts.builder()
                .subject(String.valueOf(userId))
                .claim("username", username)
                .claim("type", "access")
                .issuedAt(Date.from(now))
                .expiration(Date.from(exp))
                .signWith(secretKey, Jwts.SIG.HS256)
                .compact();
    }

    // jwt로부터 파싱
    public Long getUserIdFromToken(String token) {
        return Long.valueOf(parseToken(token).getPayload().getSubject());
    }
    public String getTypeFromToken(String token) {
        Object t = parseToken(token).getPayload().get("type");
        return t == null ? null : t.toString();
    }
    public Jws<Claims> parseToken(String token) {   // 위 메소드들 위한 메소드
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token);
    }
}
