package com.example.libraryprojectdemo.domain.auth.entity;

import com.example.libraryprojectdemo.domain.user.entity.UserEntity;
import jakarta.persistence.*;
import lombok.Getter;

@Getter
@Entity
@Table(name = "social_accounts",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_social_provider_userid",
                columnNames = {"provider", "provider_user_id"}
        ))  // provider + provider_user_id '조합'은 반드시 유일해야 한다!!
public class SocialAccountEntity {  // 소셜 로그인 후 우리 db에도 정보 저장해야 한다
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String provider;    // kakao / google / naver

    @Column(nullable = false)
    private String providerUserId;  // 위의 provider와 조합해서 id 부여

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    protected SocialAccountEntity() {}
    public SocialAccountEntity(String provider,  String providerUserId, UserEntity user) {
        this.provider = provider;
        this.providerUserId = providerUserId;
        this.user = user;
    }
}
