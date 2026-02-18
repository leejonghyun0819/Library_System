package com.example.libraryprojectdemo.domain.user.dto;

// record : 불변성, 데이터 전달
public record UserResponse(
        Long id,
        String username,
        String nickname,
        String email
) {
}
