package com.example.libraryprojectdemo.domain.auth.oauth;

import com.example.libraryprojectdemo.domain.auth.dto.SocialUserInfo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.util.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Component
public class NaverOAuthClient implements OAuthProviderClient {
    private final RestTemplate restTemplate;
    private final String clientId;
    private final String clientSecret;
    public NaverOAuthClient(RestTemplate restTemplate,
                            @Value("${oauth.naver.client-id}") String clientId,
                            @Value("${oauth.naver.client-secret}") String clientSecret) {
        this.restTemplate = restTemplate;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
    }

    @Override
    public String provider() { return "naver"; }

    @Override
    public SocialUserInfo getUserInfoByCode(String code, String redirectUri) {
        // 1. code 받아서, 네이버에서 access token 받아오기
        String tokenUrl = "https://nid.naver.com/oauth2.0/token";

        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("grant_type", "authorization_code");
        form.add("client_id", clientId);
        form.add("client_secret", clientSecret);
        form.add("code", code);
        form.add("state", "STATE"); // RN에서 state 쓰면 그대로 전달하도록 확장 추천
        // naver는 redirect_uri를 요구하지 않는 구성도 많지만, 등록된 값과 일치 필요(환경에 따라)
        // form.add("redirect_uri", redirectUri);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);  // header 데이터형식 지정

        // 네이버 서버에 post 요청 -> access token
        ResponseEntity<Map> tokenResponse = restTemplate.postForEntity(
                tokenUrl, new HttpEntity<>(form, headers), Map.class);

        String accessToken = (String) tokenResponse.getBody().get("access_token");


        // 2. accessToken 보내서 profile 받아옴
        String meUrl = "https://openapi.naver.com/v1/nid/me";
        HttpHeaders h2 = new HttpHeaders();
        h2.setBearerAuth(accessToken);

        // 네이버 서버에 get 요청 -> profile
        ResponseEntity<Map> meRes = restTemplate.exchange(
                meUrl, HttpMethod.GET, new HttpEntity<>(h2), Map.class
        );

        Map body = meRes.getBody();
        Map response = (Map) body.get("response");

        String naverId = (String) response.get("id");
        String email = response.get("email") == null ? null : response.get("email").toString();
        String nickname = response.get("nickname") == null ? null : response.get("nickname").toString();

        return new SocialUserInfo("naver", naverId, email, nickname);
    }
}
