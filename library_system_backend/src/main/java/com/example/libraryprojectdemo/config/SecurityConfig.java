package com.example.libraryprojectdemo.config;

import com.example.libraryprojectdemo.domain.jwt.JwtAuthFilter;
import com.example.libraryprojectdemo.domain.jwt.JwtProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtProvider jwtProvider) throws Exception {
        http
                // REST API 개발 단계에서는 보통 꺼둠 (브라우저 폼 기반이 아니라서)
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                // 스프링 시큐리티 기본 로그인 페이지/Basic 인증 끄기
                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable())

                // 지금 단계: API는 모두 열어둔다 (나중에 JWT 단계에서 잠글 것)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/login").permitAll()
                        .requestMatchers("/api/users").permitAll()  // user CRUD 열어놓음
                        .requestMatchers("/api/users/**").permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(new JwtAuthFilter(jwtProvider), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}