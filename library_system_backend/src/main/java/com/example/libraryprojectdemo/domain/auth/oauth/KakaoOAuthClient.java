package com.example.libraryprojectdemo.domain.auth.oauth;

import com.example.libraryprojectdemo.domain.auth.dto.SocialUserInfo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.util.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Component
public class KakaoOAuthClient implements OAuthProviderClient {
    private final RestTemplate restTemplate;
    private final String clientId;
    private final String clientSecret;
    public KakaoOAuthClient(RestTemplate restTemplate,
                            @Value("${oauth.kakao.client-id}") String clientId,
                            @Value("${oauth.kakao.client-secret:}") String clientSecret) {
        this.restTemplate = restTemplate;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
    }

    @Override
    public String provider() { return "kakao"; }

    @Override
    public SocialUserInfo getUserInfoByCode(String code, String redirectUri) {
        // 1. 받은 Auth Code로 kakao access token 받아오기
        String tokenUrl = "https://kauth.kakao.com/oauth/token";

        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("grant_type", "authorization_code");
        form.add("client_id", clientId);
        if (clientSecret != null && !clientSecret.isBlank()) form.add("client_secret", clientSecret);
        form.add("redirect_uri", redirectUri);
        form.add("code", code);

        HttpHeaders headers = new HttpHeaders();    // http 요청 '헤더' 담는 객체
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);  // 데이터 형식(json x) 명시

        ResponseEntity<Map> tokenResponse = restTemplate.postForEntity(
                tokenUrl,
                new HttpEntity<>(form, headers),    // 이 헤더로, form의 내용을 body에 담아 post로 보내라.(요청패키지)
                Map.class   // 응답 json을 받을 response type
        );

        String accessToken = (String) tokenResponse.getBody().get("access_token");  // 요청 받아서 access_token 꺼냄


        // 2. access token 을 다시 보내서 user info 받아오기
        String meUrl = "https://kapi.kakao.com/v2/user/me";
        HttpHeaders h2 = new HttpHeaders();
        h2.setBearerAuth(accessToken);

        ResponseEntity<Map> meResponse = restTemplate.exchange(
                meUrl, HttpMethod.GET, new HttpEntity<>(h2), Map.class);
        // meUrl로 get 요청 보내서, requestEntity를 보내고 Map 형식으로 json 응답 받아오겠다

        Map body = meResponse.getBody();
        // kakao user id
        String kakaoId = String.valueOf(body.get("id"));
        String email = null;
        String nickname = null;

        Object kakaoAccountObject = body.get("kakao_account");
        if (kakaoAccountObject instanceof Map kakaoAccount) {
            Object emailObject = kakaoAccount.get("email");
            if (emailObject != null) { email = emailObject.toString(); }

            Object profileObject = kakaoAccount.get("profile");
            if (profileObject instanceof Map profile) {
                Object nicknameObject = profile.get("nickname");
                if (nicknameObject != null) { nickname = nicknameObject.toString(); }
            }
        }

        return new SocialUserInfo("kakao", kakaoId, email, nickname);
    }
}
