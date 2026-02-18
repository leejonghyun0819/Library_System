package com.example.libraryprojectdemo.domain.auth.oauth;

import com.example.libraryprojectdemo.domain.auth.dto.SocialUserInfo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.util.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Component
public class GoogleOAuthClient implements OAuthProviderClient {
    private final RestTemplate restTemplate;
    private final String clientId;
    private final String clientSecret;

    public GoogleOAuthClient(RestTemplate restTemplate,
                             @Value("${oauth.google.client-id}") String clientId,
                             @Value("${oauth.google.client-secret}") String clientSecret) {
        this.restTemplate = restTemplate;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
    }

    @Override
    public String provider() { return "google"; }

    @Override
    public SocialUserInfo getUserInfoByCode(String code, String redirectUri) {
        // 1. coce -> access token
        String tokenUrl = "https://oauth2.googleapis.com/token";

        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("grant_type", "authorization_code");
        form.add("client_id", clientId);
        form.add("client_secret", clientSecret);
        form.add("redirect_uri", redirectUri);
        form.add("code", code);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        // 구글 서버에 post 요청 -> access token
        ResponseEntity<Map> tokenRes = restTemplate.postForEntity(
                tokenUrl, new HttpEntity<>(form, headers), Map.class
        );

        String accessToken = (String) tokenRes.getBody().get("access_token");

        // 2. access_token -> userinfo
        String userInfoUrl = "https://openidconnect.googleapis.com/v1/userinfo";
        HttpHeaders h2 = new HttpHeaders();
        h2.setBearerAuth(accessToken);

        // 구글 서버에 get 요청 -> profile
        ResponseEntity<Map> uiRes = restTemplate.exchange(
                userInfoUrl, HttpMethod.GET, new HttpEntity<>(h2), Map.class
        );

        Map body = uiRes.getBody();
        String sub = body.get("sub").toString(); // provider user id
        String email = body.get("email") == null ? null : body.get("email").toString();
        String name = body.get("name") == null ? null : body.get("name").toString();

        return new SocialUserInfo("google", sub, email, name);
    }
}
