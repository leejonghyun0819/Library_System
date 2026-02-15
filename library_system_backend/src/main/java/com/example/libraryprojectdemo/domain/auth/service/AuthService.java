package com.example.libraryprojectdemo.domain.auth.service;

import com.example.libraryprojectdemo.domain.auth.dto.*;
import com.example.libraryprojectdemo.domain.auth.entity.RefreshTokenEntity;
import com.example.libraryprojectdemo.domain.auth.repository.RefreshTokenRepository;
import com.example.libraryprojectdemo.domain.jwt.JwtProvider;
import com.example.libraryprojectdemo.domain.user.dto.UserResponse;
import com.example.libraryprojectdemo.domain.user.entity.UserEntity;
import com.example.libraryprojectdemo.domain.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@Transactional(readOnly = true)
public class AuthService {
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    public AuthService(UserRepository userRepository, RefreshTokenRepository refreshTokenRepository, PasswordEncoder passwordEncoder, JwtProvider jwtProvider) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtProvider = jwtProvider;
    }

    // 로그인 : access + refresh 발급 (유저당 refresh 1개)
    public AuthTokensResponse login(LoginRequest req) {
        // username 검증
        UserEntity user = userRepository.findByUsername(req.username())
                .orElseThrow(()-> new IllegalArgumentException("Invalid username"));
        // password 검증
        if (!passwordEncoder.matches(req.password(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid password");
        }

        // 기존 refresh 전부 폐기
        refreshTokenRepository.deleteByUser_Id(user.getId());
        // 로그인 성공시 accessToken 발급
        String accessToken = jwtProvider.createAccessToken(user.getId(), user.getUsername());
        String refreshToken = jwtProvider.createRefreshToken(user.getId(), user.getUsername());

        refreshTokenRepository.save(
                new RefreshTokenEntity(refreshToken, jwtProvider.getExpirationFromToken(refreshToken), user)
        );

        return new AuthTokensResponse(accessToken, refreshToken); // json으로 user 정보 전달
    }

    // refresh + rotate : refresh로 새 access + 새 refresh 발급 (기존 refresh 폐기)
    public AuthTokensResponse refreshRotate(RefreshRequest req) {
        String refreshToken = req.refreshToken();

        // 1. JWT 타입 확인/검증
        if (!"refresh".equals(jwtProvider.getTypeFromToken(refreshToken))) {
            throw new IllegalArgumentException("refresh token이 아닙니다. ");
        }
        // 2. DB에 존재 여부 확인
        RefreshTokenEntity saved = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(()-> new IllegalArgumentException("유효하지 않은 refresh token입니다. "));
        // 3. 만료 여부 확인
        if (saved.getExpiresAt().isBefore(Instant.now())) {
            refreshTokenRepository.deleteByToken(refreshToken);
            throw new IllegalArgumentException("refresh token이 만료되었습니다. ");
        }

        UserEntity user = saved.getUser();

        // 4. Rotation 핵심 : 기존 refresh 즉시 폐기 (rotate 자체가 access 뿐만 아니라 refresh도 재발급하는 개념!)
        refreshTokenRepository.deleteByToken(refreshToken);
        // 5. 새 토큰 발급 + 새 refresh 저장
        String newAccessToken = jwtProvider.createAccessToken(user.getId(), user.getUsername());
        String newRefreshToken = jwtProvider.createRefreshToken(user.getId(), user.getUsername());

        refreshTokenRepository.save(
                new RefreshTokenEntity(newRefreshToken, jwtProvider.getExpirationFromToken(newAccessToken), user)
        );

        return new AuthTokensResponse(newAccessToken, newRefreshToken);
    }

    // 로그아웃 : refresh 폐기 (클라이언트가 access도 삭제하면 된다!)
    public void logout(LogoutRequest req) {
        refreshTokenRepository.deleteByToken(req.refreshToken());
    }
}
