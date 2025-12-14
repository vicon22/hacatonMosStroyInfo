package com.mosstroyinfo.api.controller;

import com.mosstroyinfo.api.dto.CreateUserRequest;
import com.mosstroyinfo.api.dto.LoginRequest;
import com.mosstroyinfo.api.dto.LoginResponse;
import com.mosstroyinfo.api.service.AuthService;
import com.mosstroyinfo.api.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        var sessionId = authService.login(request.email(), request.password());
        
        if (sessionId != null) {
            var cookie = new Cookie("fm_session", sessionId);
            cookie.setHttpOnly(true);
            cookie.setPath("/");
            cookie.setMaxAge(86400); // 24 часа
            response.addCookie(cookie);
            
            return ResponseEntity.ok(new LoginResponse(true));
        }
        
        return ResponseEntity.ok(new LoginResponse(false));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @CookieValue(value = "fm_session", required = false) String sessionId,
            HttpServletResponse response) {
        if (sessionId != null) {
            authService.logout(sessionId);
        }

        var cookie = new Cookie("fm_session", "");
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody CreateUserRequest request) {
        try {
            var user = userService.createUser(
                    request.email(),
                    request.password(),
                    request.firstName(),
                    request.lastName()
            );
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("already exists")) {
                return ResponseEntity.status(409).body("{\"error\":\"User with this email already exists\"}");
            }
            return ResponseEntity.status(500).body("{\"error\":\"Internal server error\"}");
        }
    }
}

