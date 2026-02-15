package com.example.libraryprojectdemo.domain.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank String username,  // 이런걸 @Valid로 실행
        @NotBlank String password
) {
}
