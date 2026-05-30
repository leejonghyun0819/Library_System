package com.example.libraryprojectdemo.domain.user.controller;

import com.example.libraryprojectdemo.domain.auth.SessionConst;
import com.example.libraryprojectdemo.domain.user.dto.UserCreateRequest;
import com.example.libraryprojectdemo.domain.user.dto.UserResponse;
import com.example.libraryprojectdemo.domain.user.dto.UserUpdateRequest;
import com.example.libraryprojectdemo.domain.user.service.UserService;
import com.example.libraryprojectdemo.global.exception.UnauthorizedException;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // 회원가입은 로그인 전에도 가능해야 하므로 공개 API입니다.
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse createUser(@Valid @RequestBody UserCreateRequest req) {
        return userService.create(req);
    }

    // 현재 로그인한 사용자 정보 조회
    @GetMapping("/me")
    public UserResponse me(HttpSession session) {
        Long userId = getLoginUserId(session);
        return userService.findById(userId);
    }

    // 현재 로그인한 사용자 정보 수정
    @PatchMapping("/me")
    public UserResponse updateMe(@Valid @RequestBody UserUpdateRequest req, HttpSession session) {
        Long userId = getLoginUserId(session);
        return userService.update(userId, req);
    }

    // 현재 로그인한 사용자 탈퇴
    @DeleteMapping("/me")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMe(HttpSession session) {
        Long userId = getLoginUserId(session);
        userService.delete(userId);
        session.invalidate();
    }

    // 개발 확인용 사용자 목록입니다. 실서비스에서는 관리자 권한을 붙여야 합니다.
    @GetMapping
    public List<UserResponse> findAll(HttpSession session) {
        getLoginUserId(session);
        return userService.findAll();
    }

    // 본인 정보만 id로 조회할 수 있게 제한했습니다.
    @GetMapping("/{id}")
    public UserResponse findById(@PathVariable Long id, HttpSession session) {
        Long loginUserId = getLoginUserId(session);
        if (!loginUserId.equals(id)) {
            throw new UnauthorizedException("본인 정보만 조회할 수 있습니다.");
        }
        return userService.findById(id);
    }

    // 본인 정보만 수정할 수 있게 제한했습니다.
    @PatchMapping("/{id}")
    public UserResponse updateUser(@PathVariable Long id,
                                   @Valid @RequestBody UserUpdateRequest req,
                                   HttpSession session) {
        Long loginUserId = getLoginUserId(session);
        if (!loginUserId.equals(id)) {
            throw new UnauthorizedException("본인 정보만 수정할 수 있습니다.");
        }
        return userService.update(id, req);
    }

    // 본인 계정만 삭제할 수 있게 제한했습니다.
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable Long id, HttpSession session) {
        Long loginUserId = getLoginUserId(session);
        if (!loginUserId.equals(id)) {
            throw new UnauthorizedException("본인 계정만 삭제할 수 있습니다.");
        }
        userService.delete(id);
        session.invalidate();
    }

    private Long getLoginUserId(HttpSession session) {
        Object value = session.getAttribute(SessionConst.LOGIN_USER_ID);
        if (!(value instanceof Long userId)) {
            throw new UnauthorizedException("로그인이 필요합니다.");
        }
        return userId;
    }
}
