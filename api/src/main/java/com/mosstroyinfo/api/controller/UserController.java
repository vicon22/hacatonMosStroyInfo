package com.mosstroyinfo.api.controller;

import com.mosstroyinfo.api.dto.UserResponse;
import com.mosstroyinfo.api.service.AuthService;
import com.mosstroyinfo.api.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final AuthService authService;

    @GetMapping("/self")
    public ResponseEntity<UserResponse> getSelf(
            @CookieValue(value = "fm_session", required = false) String sessionId) {
        log.info("GET /api/users/self - Request to get current user, sessionId: {}", 
            sessionId != null && sessionId.length() > 20 ? sessionId.substring(0, 20) + "..." : sessionId);
        if (!authService.isValidSession(sessionId)) {
            log.warn("GET /api/users/self - Unauthorized: invalid session");
            return ResponseEntity.status(401).build();
        }
        
        UserResponse user = userService.getCurrentUser(sessionId);
        if (user != null) {
            log.info("GET /api/users/self - User found: {} {} (id: {})", 
                user.getFirst_name(), user.getLast_name(), user.getEmail());
        } else {
            log.warn("GET /api/users/self - User not found for sessionId");
        }
        return ResponseEntity.ok(user);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable UUID id) {
        log.info("GET /api/users/{} - Request to get user by id", id);
        UserResponse user = userService.getUserById(id);
        if (user != null) {
            log.info("GET /api/users/{} - User found: {} {}", id, user.getFirst_name(), user.getLast_name());
        } else {
            log.warn("GET /api/users/{} - User not found", id);
        }
        return ResponseEntity.ok(user);
    }
}

