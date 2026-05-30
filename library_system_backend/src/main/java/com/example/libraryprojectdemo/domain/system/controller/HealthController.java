package com.example.libraryprojectdemo.domain.system.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    // 프론트 앱에서 API 서버 연결 여부를 빠르게 확인하기 위한 테스트용 엔드포인트입니다.
    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of(
                "status", "ok",
                "serverTime", Instant.now().toString()
        );
    }
}
