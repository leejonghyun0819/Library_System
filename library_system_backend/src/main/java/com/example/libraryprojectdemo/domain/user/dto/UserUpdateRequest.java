package com.example.libraryprojectdemo.domain.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record UserUpdateRequest(
        @Size(min=2, max=20) String nickname,
        @Email String email
) {
}
