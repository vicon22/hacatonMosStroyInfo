package com.mosstroyinfo.api.config;

import com.mosstroyinfo.api.service.AuthService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class SessionAuthFilter extends OncePerRequestFilter {
    private final AuthService authService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        // Пропускаем публичные эндпоинты
        var path = request.getRequestURI();
        if (path.startsWith("/api/auth/") || 
            path.startsWith("/api/blueprints") || 
            path.startsWith("/h2-console/")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        // Для защищенных эндпоинтов проверяем сессию
        var sessionId = extractSessionId(request);
        
        if (sessionId != null && authService.isValidSession(sessionId)) {
            var userId = authService.getUserIdBySession(sessionId);
            if (userId != null) {
                var authentication =
                    new UsernamePasswordAuthenticationToken(userId, null, 
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));
                SecurityContextHolder.getContext().setAuthentication(authentication);
                filterChain.doFilter(request, response);
                return;
            }
        }
        
        // Если сессии нет для защищенного эндпоинта, пропускаем дальше
        // Spring Security сам вернет 401 через authenticationEntryPoint
        filterChain.doFilter(request, response);
    }

    private String extractSessionId(HttpServletRequest request) {
        var cookies = request.getCookies();
        if (cookies != null) {
            for (var cookie : cookies) {
                if ("fm_session".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}

