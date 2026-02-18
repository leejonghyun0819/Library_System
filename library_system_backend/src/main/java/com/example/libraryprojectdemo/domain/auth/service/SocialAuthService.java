package com.example.libraryprojectdemo.domain.auth.service;

import com.example.libraryprojectdemo.domain.auth.dto.AuthTokensResponse;
import com.example.libraryprojectdemo.domain.auth.dto.SocialLoginRequest;
import com.example.libraryprojectdemo.domain.auth.dto.SocialUserInfo;
import com.example.libraryprojectdemo.domain.auth.entity.RefreshTokenEntity;
import com.example.libraryprojectdemo.domain.auth.entity.SocialAccountEntity;
import com.example.libraryprojectdemo.domain.auth.oauth.OAuthProviderClient;
import com.example.libraryprojectdemo.domain.auth.repository.RefreshTokenRepository;
import com.example.libraryprojectdemo.domain.auth.repository.SocialAccountRepository;
import com.example.libraryprojectdemo.domain.auth.jwt.JwtProvider;
import com.example.libraryprojectdemo.domain.user.entity.UserEntity;
import com.example.libraryprojectdemo.domain.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class SocialAuthService {
    private final List<OAuthProviderClient> clients;
    // OAuthClient 타입의 Bean(Component) 들을 스프링이 알아서 모아줌 : GoogleOAuthClient, Kakao, Naver,,,
    private final SocialAccountRepository socialAccountRepository;
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtProvider jwtProvider;
    public SocialAuthService(List<OAuthProviderClient> clients,
                             SocialAccountRepository socialAccountRepository, UserRepository userRepository, RefreshTokenRepository refreshTokenRepository, JwtProvider jwtProvider) {
        this.clients = clients;
        this.socialAccountRepository = socialAccountRepository;
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtProvider = jwtProvider;
    }

    public AuthTokensResponse socialLogin(String provider, SocialLoginRequest request) {
    // client(provider) 뽑아오고
        OAuthProviderClient client = clients.stream()
                .filter(cli->cli.provider().equals(provider))
                // client들마다 돌면서 'provider 필드'가 '받아온 provider' 와 일치하는 Bean 찾아서 객체 가져옴
                // provider가 kakao였으면 client 변수에 KakaoOAuthClient가 들어가는 것.
                .findFirst()
                .orElseThrow(()->new IllegalArgumentException("No OAuth provider found for " + provider));

        // user 정보 가져와서 담기
        SocialUserInfo userInfo = client.getUserInfoByCode(request.code(), request.redirectUri());

        // 1. 이미 소셜 계정 연결돼 있으면 그 유저로 로그인
        UserEntity user = socialAccountRepository
                .findByProviderAndProviderUserId(userInfo.provider(), userInfo.providerUserId())
                .map(SocialAccountEntity::getUser)
                .orElseGet(() -> {
                    // 2. 최초 소셜 로그인 -> 로컬 유저 생성 + 소셜 계정 연결
                    // username 정책: "provider_providerUserId" 같이 충돌 없는 값 추천
                    String username = userInfo.provider() + "_" + userInfo.providerUserId();
                    String nickname = (userInfo.nickname()!=null && !userInfo.nickname().isBlank())     // nickname 제공받을시
                            ? userInfo.nickname() : userInfo.provider()+"User";

                    // 소셜 로그인은 비밀번호 사용하지 않으므로 dummy data(임의 해시 문자열)
                    String dummyHash = "{SOCIAL}";
                    UserEntity newUser = userRepository.save(
                            new UserEntity(username, nickname,
                            userInfo.email()==null?(username+"@no-email.local") : userInfo.email(),
                            dummyHash));
                    // 자체 로그인, 소셜 로그인 구분하려면 UserEntity에 isSocial 필드 추가해야!


                    socialAccountRepository.save(
                            new SocialAccountEntity(userInfo.provider(), userInfo.providerUserId(), newUser)
                    );
                    return newUser;
                });     // UserEntity 객체 return (기존이면 기존, 신규면 소셜 연결해서

        // access, refresh(rotate 포함) 토큰 발급
        refreshTokenRepository.deleteByUser_Id(user.getId());

        String access = jwtProvider.createAccessToken(user.getId(), user.getUsername());
        String refresh = jwtProvider.createRefreshToken(user.getId(), user.getUsername());

        refreshTokenRepository.save(
                new RefreshTokenEntity(refresh, jwtProvider.getExpirationFromToken(refresh), user)
        );

        return new AuthTokensResponse(access, refresh);
    }
}
