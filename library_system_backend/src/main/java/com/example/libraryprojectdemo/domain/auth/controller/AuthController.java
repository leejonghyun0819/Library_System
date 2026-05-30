package com.example.libraryprojectdemo.domain.auth.controller;

import com.example.libraryprojectdemo.domain.auth.SessionConst;
import com.example.libraryprojectdemo.domain.auth.dto.LoginRequest;
import com.example.libraryprojectdemo.domain.auth.service.AuthService;
import com.example.libraryprojectdemo.domain.user.dto.UserResponse;
import com.example.libraryprojectdemo.global.exception.UnauthorizedException;
import jakarta.servlet.http.HttpSession;
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

    // 자체 로그인: JWT를 발급하지 않고 서버 세션에 로그인 사용자 id를 저장합니다.
    @PostMapping("/login")
    public UserResponse login(@Valid @RequestBody LoginRequest req, HttpSession session) {
        UserResponse user = authService.login(req);
        session.setAttribute(SessionConst.LOGIN_USER_ID, user.id());
        return user;
    }

    // 현재 세션 로그인 여부 확인용입니다. 프론트 앱 시작/프로필 진입 시 호출합니다.
    @GetMapping("/status")
    public boolean status(HttpSession session) {
        return session.getAttribute(SessionConst.LOGIN_USER_ID) != null;
    }

    // 자체 로그아웃: 서버 세션을 제거합니다.
    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(HttpSession session) {
        if (session.getAttribute(SessionConst.LOGIN_USER_ID) == null) {
            throw new UnauthorizedException("이미 로그아웃 상태입니다.");
        }
        session.invalidate();
    }
}
