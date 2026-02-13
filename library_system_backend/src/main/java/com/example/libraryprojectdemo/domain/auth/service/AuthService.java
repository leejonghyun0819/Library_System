package com.example.libraryprojectdemo.domain.auth.service;

import com.example.libraryprojectdemo.domain.auth.dto.LoginRequest;
import com.example.libraryprojectdemo.domain.auth.dto.LoginResponse;
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
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // 로그인
    public LoginResponse login(LoginRequest req) {
        // username 검증
        UserEntity user = userRepository.findByUsername(req.username())
                .orElseThrow(()-> new IllegalArgumentException("Invalid username"));
        // password 검증
        if (!passwordEncoder.matches(req.password(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid password");
        }
        // 로그인 -> 검증 통과시 유저 정보 불러옴
        UserResponse userResponse = new UserResponse(user.getId(), user.getUsername(), user.getNickname(), user.getEmail());

        return new LoginResponse(userResponse); // json으로 user 정보 전달
    }

    // 로그아웃
}
