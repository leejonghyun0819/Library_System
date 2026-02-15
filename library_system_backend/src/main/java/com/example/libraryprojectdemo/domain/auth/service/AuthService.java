package com.example.libraryprojectdemo.domain.auth.service;

import com.example.libraryprojectdemo.domain.auth.dto.LoginRequest;
import com.example.libraryprojectdemo.domain.auth.dto.LoginResponse;
import com.example.libraryprojectdemo.domain.auth.dto.LoginTokenResponse;
import com.example.libraryprojectdemo.domain.jwt.JwtProvider;
import com.example.libraryprojectdemo.domain.user.dto.UserResponse;
import com.example.libraryprojectdemo.domain.user.entity.UserEntity;
import com.example.libraryprojectdemo.domain.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtProvider jwtProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtProvider = jwtProvider;
    }

    // 로그인
    public LoginTokenResponse login(LoginRequest req) {
        // username 검증
        UserEntity user = userRepository.findByUsername(req.username())
                .orElseThrow(()-> new IllegalArgumentException("Invalid username"));
        // password 검증
        if (!passwordEncoder.matches(req.password(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid password");
        }
        // 로그인 성공시 accessToken 발급
        String accessToken = jwtProvider.createAccessToken(user.getId(), user.getUsername());
        return new LoginTokenResponse(accessToken); // json으로 user 정보 전달
    }

    // 로그아웃
}
