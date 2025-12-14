package com.mosstroyinfo.api.config;

import com.mosstroyinfo.api.service.AuthService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Slf4j
@Component
@RequiredArgsConstructor
public class SessionAuthFilter extends OncePerRequestFilter {
    private final AuthService authService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String path = request.getRequestURI();
        String method = request.getMethod();
        
        // Пропускаем публичные эндпоинты
        if (path.startsWith("/api/auth/") || 
            path.startsWith("/api/blueprints") || 
            path.startsWith("/h2-console/")) {
            log.debug("Public endpoint accessed: {} {}", method, path);
            filterChain.doFilter(request, response);
            return;
        }
        
        // Для защищенных эндпоинтов проверяем сессию
        log.info("Protected endpoint accessed: {} {}", method, path);
        String sessionId = extractSessionId(request);
        
        if (sessionId != null) {
            log.info("Session ID extracted: {} (first 20 chars)", sessionId.length() > 20 ? sessionId.substring(0, 20) + "..." : sessionId);
            boolean isValid = authService.isValidSession(sessionId);
            log.info("Session valid: {}", isValid);
            
            if (isValid) {
                java.util.UUID userId = authService.getUserIdBySession(sessionId);
                log.info("User ID from session: {}", userId);
                if (userId != null) {
                    UsernamePasswordAuthenticationToken authentication = 
                        new UsernamePasswordAuthenticationToken(userId, null, 
                            Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    log.info("Authentication set for user: {}", userId);
                    filterChain.doFilter(request, response);
                    return;
                } else {
                    log.warn("Session {} is valid but userId is null", sessionId.substring(0, Math.min(20, sessionId.length())));
                }
            } else {
                log.warn("Invalid session: {} (first 20 chars)", sessionId.length() > 20 ? sessionId.substring(0, 20) + "..." : sessionId);
            }
        } else {
            log.warn("No session cookie found for protected endpoint: {} {}", method, path);
        }
        
        // Если сессии нет для защищенного эндпоинта, пропускаем дальше
        // Spring Security сам вернет 401 через authenticationEntryPoint
        log.debug("Proceeding without authentication - Spring Security will return 401");
        filterChain.doFilter(request, response);
    }

    private String extractSessionId(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            log.debug("Total cookies received: {}", cookies.length);
            for (Cookie cookie : cookies) {
                log.debug("Cookie: {} = {} (length: {})", cookie.getName(), 
                    cookie.getValue().length() > 20 ? cookie.getValue().substring(0, 20) + "..." : cookie.getValue(),
                    cookie.getValue().length());
                if ("fm_session".equals(cookie.getName())) {
                    log.debug("Found fm_session cookie");
                    return cookie.getValue();
                }
            }
        } else {
            log.debug("No cookies in request");
        }
        return null;
    }
}

