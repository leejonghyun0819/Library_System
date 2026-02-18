package com.example.libraryprojectdemo.domain.auth.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/*
    1.Authorization 헤더에서 Bearer 토큰 추출
    2.검증 성공하면 SecurityContext 에 userId를 저장
    3.컨트롤러에서 userId를 꺼내서 “내 정보” 조회
 */
public class JwtAuthFilter extends OncePerRequestFilter {   // Bearer 토큰 읽어서 로그인 처리하는 게 핵심
    private final JwtProvider jwtProvider;
    public JwtAuthFilter(JwtProvider jwtProvider) {
        this.jwtProvider = jwtProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException { //import 받으면 됨
        String header = request.getHeader("Authorization");

        if (header!=null && header.startsWith("Bearer ")) { // jwt 토큰은 반드시 "Bearer "로 시작!
            String token = header.substring(7);

            try {
                if ("access".equals(jwtProvider.getTypeFromToken(token))) {
                    Long userId = jwtProvider.getUserIdFromToken(token);

                    // principal 에 userId 저장
                    var auth = new UsernamePasswordAuthenticationToken(userId, null, List.of());
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            } catch (Exception e) {
                // 토큰이 잘못되면 인증정보 제거 -> 401
                SecurityContextHolder.clearContext();
            }
        }
        filterChain.doFilter(request, response);
    }   // 이제 SecurityConfig의 SecurityFilter에 등록
}
