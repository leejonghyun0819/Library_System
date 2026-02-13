package com.example.libraryprojectdemo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // REST API 개발 단계에서는 보통 꺼둠 (브라우저 폼 기반이 아니라서)
                .csrf(csrf -> csrf.disable())

                // 스프링 시큐리티 기본 로그인 페이지/Basic 인증 끄기
                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable())

                // 지금 단계: API는 모두 열어둔다 (나중에 JWT 단계에서 잠글 것)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/**").permitAll()
                        .anyRequest().permitAll()
                );

        return http.build();
    }
}