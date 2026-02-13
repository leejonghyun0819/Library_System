package com.example.libraryprojectdemo.domain.auth.dto;

import com.example.libraryprojectdemo.domain.user.dto.UserResponse;

public record LoginResponse(
        // UserResponse를 받아 전달
        UserResponse userResponse
) {
}
