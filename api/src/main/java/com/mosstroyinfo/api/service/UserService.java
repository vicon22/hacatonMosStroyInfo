package com.mosstroyinfo.api.service;

import com.mosstroyinfo.api.dto.UserResponse;
import com.mosstroyinfo.api.model.User;
import com.mosstroyinfo.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final AuthService authService;

    public UserResponse getUserById(UUID id) {
        var user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return new UserResponse(
                user.getFirstName(),
                user.getLastName(),
                user.getEmail()
        );
    }

    public UserResponse getCurrentUser(String sessionId) {
        var userId = authService.getUserIdBySession(sessionId);
        if (userId == null) {
            throw new RuntimeException("Unauthorized");
        }
        return getUserById(userId);
    }

    @Transactional
    public UserResponse createUser(String email, String password, String firstName, String lastName) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("User with this email already exists");
        }

        var user = new User();
        user.setEmail(email);
        user.setPassword(password);
        user.setFirstName(firstName);
        user.setLastName(lastName);

        var savedUser = userRepository.save(user);
        
        return new UserResponse(
                savedUser.getFirstName(),
                savedUser.getLastName(),
                savedUser.getEmail()
        );
    }
}

