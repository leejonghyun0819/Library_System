package com.example.libraryprojectdemo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class HttpClientConfig { // RestTemplate Bean
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();  // postForEntity, exchange 등 여러 가지 http 관련 기능 편리하게 수행
    }
}
