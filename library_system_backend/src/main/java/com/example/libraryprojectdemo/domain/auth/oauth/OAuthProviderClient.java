package com.example.libraryprojectdemo.domain.auth.oauth;

import com.example.libraryprojectdemo.domain.auth.dto.SocialUserInfo;

public interface OAuthProviderClient {  // Provider Client 공통 인터페이스
    String provider();  // "kakao" | "google" | "naver"
    SocialUserInfo getUserInfoByCode(String code, String redirectUri);
}