package com.example.libraryprojectdemo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    // CORS로 막힘 방지 (원래는 SecurityConfig에서 처리하기도)

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(
                        "http://localhost:19006",   // Expo web 디버그 등 (필요 시)
                        "http://localhost:3000"     // 혹시 웹 프론트 붙이면
                )
                .allowedMethods("GET", "POST", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }
}
