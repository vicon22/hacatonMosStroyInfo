package com.mosstroyinfo.api.controller;

import com.mosstroyinfo.api.dto.CreateUserRequest;
import com.mosstroyinfo.api.dto.LoginRequest;
import com.mosstroyinfo.api.dto.LoginResponse;
import com.mosstroyinfo.api.dto.UserResponse;
import com.mosstroyinfo.api.service.AuthService;
import com.mosstroyinfo.api.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response) {
        log.info("Login request received for email: {}", request.getEmail());
        String sessionId = authService.login(request.getEmail(), request.getPassword());
        
        if (sessionId != null) {
            Cookie cookie = new Cookie("fm_session", sessionId);
            cookie.setHttpOnly(true);
            cookie.setPath("/");
            cookie.setMaxAge(86400); // 24 часа
            response.addCookie(cookie);
            log.info("Login successful, cookie set for session: {} (first 20 chars)", 
                sessionId.substring(0, Math.min(20, sessionId.length())) + "...");
            return ResponseEntity.ok(new LoginResponse(true));
        }
        
        log.warn("Login failed for email: {}", request.getEmail());
        return ResponseEntity.ok(new LoginResponse(false));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @CookieValue(value = "fm_session", required = false) String sessionId,
            HttpServletResponse response) {
        log.info("Logout request received, sessionId: {}", 
            sessionId != null && sessionId.length() > 20 ? sessionId.substring(0, 20) + "..." : sessionId);
        if (sessionId != null) {
            authService.logout(sessionId);
        } else {
            log.warn("Logout request without sessionId");
        }
        
        Cookie cookie = new Cookie("fm_session", "");
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody CreateUserRequest request) {
        log.info("POST /api/auth/register - Registration request for email: {}, firstName: {}, lastName: {}", 
            request.getEmail(), request.getFirstName(), request.getLastName());
        try {
            UserResponse user = userService.createUser(
                    request.getEmail(),
                    request.getPassword(),
                    request.getFirstName(),
                    request.getLastName()
            );
            log.info("POST /api/auth/register - User registered successfully: {} (id: {})", 
                request.getEmail(), user.getId());
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            log.error("POST /api/auth/register - Registration failed for email: {}, error: {}", 
                request.getEmail(), e.getMessage(), e);
            if (e.getMessage().contains("already exists")) {
                return ResponseEntity.status(409).body("{\"error\":\"User with this email already exists\"}");
            }
            return ResponseEntity.status(500).body("{\"error\":\"Internal server error\"}");
        }
    }
}

