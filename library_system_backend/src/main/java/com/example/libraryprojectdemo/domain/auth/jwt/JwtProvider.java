package com.example.libraryprojectdemo.domain.auth.jwt;

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
    private final long refreshExpSec;
    public JwtProvider(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.access-exp-seconds:900}") long accessExpSec,
            @Value("${jwt.refresh-exp-seconds:1209600}") long refreshExpSec // 14일 기본
             ) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes()); // byte 로 읽어와서 hash 후 저장
        this.accessExpSec = accessExpSec;
        this.refreshExpSec = refreshExpSec;
    }

    // jwt token 생성 본체
    private String createToken(Long userId, String username, long expSec, String type) {
        Instant now = Instant.now();
        Instant exp = now.plusSeconds(expSec);

        return Jwts.builder()
                .subject(String.valueOf(userId))
                .claim("username", username)
                .claim("type", type)
                .issuedAt(Date.from(now))
                .expiration(Date.from(exp))
                .signWith(secretKey, Jwts.SIG.HS256)
                .compact();
    }

    // 실제 accessToken 생성
    public String createAccessToken(Long userId, String username) {
        return createToken(userId, username, accessExpSec, "access");
    }

    // 실제 refreshToken 생성
    public String createRefreshToken(Long userId, String username) {
        return createToken(userId, username, refreshExpSec, "refresh");
    }

    // jwt로부터 파싱
    public Long getUserIdFromToken(String token) {
        return Long.valueOf(parse(token).getPayload().getSubject());
    }
    public String getTypeFromToken(String token) {
        Object t = parse(token).getPayload().get("type");
        return t == null ? null : t.toString();
    }
    public Instant getExpirationFromToken(String token) {
        return parse(token).getPayload().getExpiration().toInstant();
    }
    public Jws<Claims> parse(String token) {   // 위 메소드들 위한 메소드
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token);
    }
}
