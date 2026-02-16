package com.example.libraryprojectdemo.domain.auth.controller;

import com.example.libraryprojectdemo.domain.auth.dto.AuthTokensResponse;
import com.example.libraryprojectdemo.domain.auth.dto.SocialLoginRequest;
import com.example.libraryprojectdemo.domain.auth.service.SocialAuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/social")
public class SocialAuthController {
    private final SocialAuthService socialAuthService;
    public SocialAuthController(SocialAuthService socialAuthService) {
        this.socialAuthService = socialAuthService;
    }

    @PostMapping("/{provider}")
    public AuthTokensResponse socialLogin(@PathVariable("provider") String provider,
                                          @Valid @RequestBody SocialLoginRequest request) {
        return socialAuthService.socialLogin(provider, request);
    }
}
