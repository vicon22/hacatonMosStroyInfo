package com.mosstroyinfo.api.controller;

import com.mosstroyinfo.api.dto.UserResponse;
import com.mosstroyinfo.api.service.AuthService;
import com.mosstroyinfo.api.service.UserService;
import lombok.experimental.FieldDefaults;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static lombok.AccessLevel.PRIVATE;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@FieldDefaults(level = PRIVATE)
class UserControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockBean
    UserService userService;

    @MockBean
    AuthService authService;

    @Test
    void getSelf_success() throws Exception {
        // Arrange
        var userId = UUID.randomUUID();
        var sessionId = "session-123";

        var mockResponse = new UserResponse();
        mockResponse.setFirst_name("John");
        mockResponse.setLast_name("Doe");
        mockResponse.setEmail("john.doe@example.com");
        
        when(authService.isValidSession(sessionId)).thenReturn(true);
        when(authService.getUserIdBySession(sessionId)).thenReturn(userId);
        when(userService.getCurrentUser(sessionId)).thenReturn(mockResponse);

        // Act & Assert
        mockMvc.perform(get("/api/users/self")
                .cookie(new jakarta.servlet.http.Cookie("fm_session", sessionId)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.first_name").value("John"))
                .andExpect(jsonPath("$.last_name").value("Doe"))
                .andExpect(jsonPath("$.email").value("john.doe@example.com"));
    }
}