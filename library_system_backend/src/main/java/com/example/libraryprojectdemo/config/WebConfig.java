package com.example.libraryprojectdemo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                // Expo Web/Expo Go 로컬 테스트용입니다. 세션 쿠키를 주고받아야 하므로 credentials를 허용합니다.
                // 운영 배포 시에는 allowedOriginPatterns("*") 대신 실제 프론트 주소만 넣는 것이 안전합니다.
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
