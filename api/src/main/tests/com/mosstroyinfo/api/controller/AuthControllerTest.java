package com.mosstroyinfo.api.controller;

import com.mosstroyinfo.api.dto.UserResponse;
import com.mosstroyinfo.api.service.AuthService;
import com.mosstroyinfo.api.service.UserService;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static lombok.AccessLevel.PRIVATE;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@FieldDefaults(level = PRIVATE)
class AuthControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockBean
    AuthService authService;

    @MockBean
    UserService userService;

    @Test
    void login_success() throws Exception {
        // Arrange
        var loginRequest = "{\"email\":\"test@example.com\",\"password\":\"password123\"}";
        when(authService.login("test@example.com", "password123")).thenReturn("session-123");

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginRequest))
                .andExpect(status().isOk());
    }

    @Test
    void logout_success() throws Exception {
        // Act & Assert
        mockMvc.perform(post("/api/auth/logout")
                .cookie(new jakarta.servlet.http.Cookie("fm_session", "session-123")))
                .andExpect(status().isNoContent());
    }

    @Test
    void register_success() throws Exception {
        // Arrange
        var registerRequest = "{\"email\":\"newuser@example.com\",\"password\":\"password123\",\"firstName\":\"John\",\"lastName\":\"Doe\"}";

        var mockResponse = new UserResponse();
        mockResponse.setEmail("newuser@example.com");
        mockResponse.setFirst_name("John");
        mockResponse.setLast_name("Doe");
        
        when(userService.createUser("newuser@example.com", "password123", "John", "Doe"))
                .thenReturn(mockResponse);

        // Act & Assert
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(registerRequest))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("newuser@example.com"))
                .andExpect(jsonPath("$.first_name").value("John"))
                .andExpect(jsonPath("$.last_name").value("Doe"));
    }
}