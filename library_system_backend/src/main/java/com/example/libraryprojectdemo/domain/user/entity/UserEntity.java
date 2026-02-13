package com.example.libraryprojectdemo.domain.user.entity;

import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Getter
public class UserEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length=20, unique=true)
    private String username;

    @Column(nullable = false)
    private String nickname;

    @Column(nullable = false, unique=true)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    protected UserEntity() {    }

    public UserEntity(String username, String nickname, String email, String passwordHash) {
        this.username = username;
        this.nickname = nickname;
        this.email = email;
        this.passwordHash = passwordHash;
    }

    // 회원정보 변경시
    public void changeNickname(String newNickname) { this.nickname = newNickname; }
    public void changeEmail(String newEmail) { this.email = newEmail; }
}
