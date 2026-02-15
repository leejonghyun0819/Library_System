package com.example.libraryprojectdemo.domain.auth.controller;

import com.example.libraryprojectdemo.domain.auth.dto.*;
import com.example.libraryprojectdemo.domain.auth.service.AuthService;
import com.example.libraryprojectdemo.global.dto.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
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
    public AuthTokensResponse login(@Valid @RequestBody LoginRequest req) {
        return authService.login(req);
    }

    // refresh (rotate)
    @PostMapping("/refresh")
    public AuthTokensResponse refresh(@Valid @RequestBody RefreshRequest req) {
        return authService.refreshRotate(req);
    }

    // 로그아웃
    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(@Valid @RequestBody LogoutRequest req) {
        authService.logout(req);
    }
}
