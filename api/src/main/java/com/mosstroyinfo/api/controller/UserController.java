package com.mosstroyinfo.api.controller;

import com.mosstroyinfo.api.dto.UserResponse;
import com.mosstroyinfo.api.service.AuthService;
import com.mosstroyinfo.api.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final AuthService authService;

    @GetMapping("/self")
    public ResponseEntity<UserResponse> getSelf(
            @CookieValue(value = "fm_session", required = false) String sessionId) {
        if (!authService.isValidSession(sessionId)) {
            return ResponseEntity.status(401).build();
        }
        
        UserResponse user = userService.getCurrentUser(sessionId);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable UUID id) {
        UserResponse user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }
}

