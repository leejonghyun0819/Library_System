package com.example.libraryprojectdemo.domain.user.service;

import com.example.libraryprojectdemo.config.PasswordConfig;
import com.example.libraryprojectdemo.domain.user.dto.UserCreateRequest;
import com.example.libraryprojectdemo.domain.user.dto.UserResponse;
import com.example.libraryprojectdemo.domain.user.dto.UserUpdateRequest;
import com.example.libraryprojectdemo.domain.user.entity.UserEntity;
import com.example.libraryprojectdemo.domain.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

// crud 구현
@Service
@Transactional
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    public UserService(UserRepository userRepository, PasswordConfig passwordConfig, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // entity를 응답 dto로 변환
    private UserResponse toResponse(UserEntity e) {
        return new UserResponse(e.getId(), e.getUsername(), e.getNickname(), e.getEmail());
    }

    // 회원가입
    public UserResponse create(UserCreateRequest req) {
        // 회원가입 전 검증, 예외처리
        if (userRepository.existsByUsername(req.username())) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (userRepository.existsByEmail(req.email())) {
            throw new IllegalArgumentException("Email already exists");
        }

        String hash = passwordEncoder.encode(req.password());
        UserEntity saved = userRepository.save(
                new UserEntity(req.username(), req.nickname(), req.email(), hash)
        );
        return toResponse(saved);   // dto 형태로
    }

    @Transactional(readOnly = true) // 트랜잭션 낭비 줄이기
    public List<UserResponse> findAll() {
        return userRepository.findAll().stream().map(this::toResponse).toList();
    }
    @Transactional(readOnly = true)
    public UserResponse findById(Long id) {
        UserEntity user = userRepository.findById(id).orElseThrow(()->new IllegalArgumentException("User not found"));
        return toResponse(user);
    }

    // 회원정보 수정
    public UserResponse update(Long id, UserUpdateRequest req) {    //
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // 검중 후 entity의 change 함수 호출해 다시 돌려줌
        if (req.nickname() != null && !req.nickname().isBlank()) { user.changeNickname(req.nickname()); }
        if (req.email() != null && !req.email().isBlank()) { user.changeEmail(req.email()); }

        return toResponse(user);    // dto 형태로
    }

    // 회원 삭제
    public void delete(Long id) {
        if (!userRepository.existsById(id)) {
            throw new IllegalArgumentException("User not found");
        }
        userRepository.deleteById(id);
    }
}