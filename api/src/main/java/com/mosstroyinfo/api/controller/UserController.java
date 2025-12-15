package com.mosstroyinfo.api.controller;

import com.mosstroyinfo.api.dto.UserResponse;
import com.mosstroyinfo.api.service.AuthService;
import com.mosstroyinfo.api.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

import static lombok.AccessLevel.PRIVATE;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@FieldDefaults(level = PRIVATE, makeFinal = true)
public class UserController {
    UserService userService;
    AuthService authService;

    @GetMapping("/self")
    public ResponseEntity<UserResponse> getSelf(
            @CookieValue(value = "fm_session", required = false) String sessionId) {
        if (!authService.isValidSession(sessionId)) {
            return ResponseEntity.status(401).build();
        }

        var user = userService.getCurrentUser(sessionId);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable UUID id) {
        var user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }
}

