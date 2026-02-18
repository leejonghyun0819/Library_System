package com.example.libraryprojectdemo.domain.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserCreateRequest(
        @NotBlank @Size(min=2, max=20) String username,
        @NotBlank @Size(min=2, max=20) String nickname,
        @Email @NotBlank String email,
        @NotBlank @Size(min=4, max=50) String password
) {
}
