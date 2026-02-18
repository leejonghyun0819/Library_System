package com.example.libraryprojectdemo.domain.auth.dto;

public record AuthTokensResponse(
        String accessToken,
        String refreshToken
) {
}
