package com.example.libraryprojectdemo.domain.auth.entity;

import com.example.libraryprojectdemo.domain.user.entity.UserEntity;
import jakarta.persistence.*;
import lombok.Getter;

import java.time.Instant;

@Entity
@Getter
@Table(name = "refresh_tokens",
        indexes = { // db에서 조회 빠르도록 index 지정(optional)
                @Index(name="idx_refresh_user", columnList="user_id"),
                @Index(name="idx_refresh_token", columnList="token", unique = true)
        })
public class RefreshTokenEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @Column(nullable = false)
    private Instant expiresAt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name="user_id", nullable = false)
    private UserEntity user;

    protected RefreshTokenEntity() {}
    public RefreshTokenEntity(String token, Instant expiresAt, UserEntity user) {
        this.token = token;
        this.expiresAt = expiresAt;
        this.user = user;
    }
}
