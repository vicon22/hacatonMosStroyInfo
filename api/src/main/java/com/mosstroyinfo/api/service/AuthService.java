package com.mosstroyinfo.api.service;

import com.mosstroyinfo.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import static lombok.AccessLevel.PRIVATE;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = PRIVATE, makeFinal = true)
public class AuthService {
    UserRepository userRepository;
    
    // Простое хранилище сессий
    ConcurrentHashMap<String, UUID> sessions = new ConcurrentHashMap<>();

    public String login(String email, String password) {
        var user = userRepository.findByEmail(email)
                .orElse(null);
        
        if (user != null && user.getPassword().equals(password)) {
            var sessionId = UUID.randomUUID().toString();
            sessions.put(sessionId, user.getId());
            return sessionId;
        }
        
        return null;
    }

    public void logout(String sessionId) {
        sessions.remove(sessionId);
    }

    public UUID getUserIdBySession(String sessionId) {
        return sessions.get(sessionId);
    }

    public boolean isValidSession(String sessionId) {
        return sessionId != null && sessions.containsKey(sessionId);
    }
}

