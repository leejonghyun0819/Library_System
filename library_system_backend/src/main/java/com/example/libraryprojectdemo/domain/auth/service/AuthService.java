package com.example.libraryprojectdemo.domain.auth.service;

import com.example.libraryprojectdemo.domain.auth.dto.LoginRequest;
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

    public UserResponse login(LoginRequest req) {
        UserEntity user = userRepository.findByUsername(req.username())
                .orElseThrow(() -> new IllegalArgumentException("아이디 또는 비밀번호가 올바르지 않습니다."));

        if (!passwordEncoder.matches(req.password(), user.getPasswordHash())) {
            throw new IllegalArgumentException("아이디 또는 비밀번호가 올바르지 않습니다.");
        }

        return new UserResponse(user.getId(), user.getUsername(), user.getNickname(), user.getEmail());
    }
}
