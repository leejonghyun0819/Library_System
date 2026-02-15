package com.example.libraryprojectdemo.domain.auth.controller;

import com.example.libraryprojectdemo.domain.auth.dto.LoginRequest;
import com.example.libraryprojectdemo.domain.auth.dto.LoginResponse;
import com.example.libraryprojectdemo.domain.auth.dto.LoginTokenResponse;
import com.example.libraryprojectdemo.domain.auth.service.AuthService;
import com.example.libraryprojectdemo.global.dto.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // 로그인
    @PostMapping("/login")
    public ApiResponse<LoginTokenResponse> login(@Valid @RequestBody LoginRequest req) {
        return ApiResponse.ok(authService.login(req));
    }
//    public LoginTokenResponse login(@Valid @RequestBody LoginRequest req) {
//        return authService.login(req);
//    }

    // 로그아웃 (JWT/세션 도입 전에는 dummy)
    @PostMapping("/logout")
    public ApiResponse<Void> logout() {
        return ApiResponse.ok(null);
    }
}
