package com.mosstroyinfo.api.service;

import com.mosstroyinfo.api.model.User;
import com.mosstroyinfo.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    
    // Простое хранилище сессий
    private final ConcurrentHashMap<String, UUID> sessions = new ConcurrentHashMap<>();

    public String login(String email, String password) {
        log.info("Attempting login for email: {}", email);
        User user = userRepository.findByEmail(email)
                .orElse(null);
        
        if (user != null && user.getPassword().equals(password)) {
            String sessionId = UUID.randomUUID().toString();
            sessions.put(sessionId, user.getId());
            log.info("Login successful for user: {} (userId: {}), session created: {} (first 20 chars)", 
                email, user.getId(), sessionId.substring(0, Math.min(20, sessionId.length())) + "...");
            log.debug("Total active sessions: {}", sessions.size());
            return sessionId;
        }
        
        log.warn("Login failed for email: {} - user not found or password incorrect", email);
        return null;
    }

    public void logout(String sessionId) {
        if (sessionId != null) {
            UUID userId = sessions.get(sessionId);
            sessions.remove(sessionId);
            log.info("Logout successful for session: {} (first 20 chars), userId: {}, remaining sessions: {}", 
                sessionId.length() > 20 ? sessionId.substring(0, 20) + "..." : sessionId, 
                userId, sessions.size());
        } else {
            log.warn("Logout attempted with null sessionId");
        }
    }

    public UUID getUserIdBySession(String sessionId) {
        UUID userId = sessions.get(sessionId);
        if (userId != null) {
            log.debug("Retrieved userId: {} for session: {} (first 20 chars)", 
                userId, sessionId.length() > 20 ? sessionId.substring(0, 20) + "..." : sessionId);
        } else {
            log.debug("No userId found for session: {} (first 20 chars)", 
                sessionId != null && sessionId.length() > 20 ? sessionId.substring(0, 20) + "..." : sessionId);
        }
        return userId;
    }

    public boolean isValidSession(String sessionId) {
        boolean isValid = sessionId != null && sessions.containsKey(sessionId);
        log.debug("Session validation for {} (first 20 chars): {}", 
            sessionId != null && sessionId.length() > 20 ? sessionId.substring(0, 20) + "..." : sessionId, 
            isValid);
        if (!isValid && sessionId != null) {
            log.debug("Active sessions count: {}", sessions.size());
        }
        return isValid;
    }
}

