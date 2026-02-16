package com.example.libraryprojectdemo.domain.auth.dto;

public record SocialUserInfo(
        String provider,
        String providerUserId,
        String email,
        String nickname
) {
}
