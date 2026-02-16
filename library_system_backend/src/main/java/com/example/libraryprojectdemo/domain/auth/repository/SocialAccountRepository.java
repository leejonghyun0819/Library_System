package com.example.libraryprojectdemo.domain.auth.repository;

import com.example.libraryprojectdemo.domain.auth.entity.SocialAccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SocialAccountRepository extends JpaRepository<SocialAccountEntity, Long> {
    Optional<SocialAccountEntity> findByProviderAndProviderUserId(String provider, String providerUserId);
    // 무조건 둘의 '조합'으로 찾아야 한다
}
