package com.mosstroyinfo.api.controller;

import com.mosstroyinfo.api.dto.CreateMessageRequest;
import com.mosstroyinfo.api.dto.MessageResponse;
import com.mosstroyinfo.api.service.AuthService;
import com.mosstroyinfo.api.service.MessageService;
import lombok.experimental.FieldDefaults;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static lombok.AccessLevel.PRIVATE;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@FieldDefaults(level = PRIVATE)
class MessageControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockBean
    MessageService messageService;

    @MockBean
    AuthService authService;

    @Test
    void getMessages_success() throws Exception {
        // Arrange
        var roomId = "project-123";
        var userId = UUID.randomUUID();

        var message1 = new MessageResponse();
        message1.setId(UUID.randomUUID());
        message1.setUserId(userId.toString());
        message1.setRoomId(roomId);
        message1.setMessage("Hello, team!");
        message1.setCreatedAt(LocalDateTime.now().minusHours(1));

        var message2 = new MessageResponse();
        message2.setId(UUID.randomUUID());
        message2.setUserId(userId.toString());
        message2.setRoomId(roomId);
        message2.setMessage("Looking forward to the meeting");
        message2.setCreatedAt(LocalDateTime.now());
        
        when(authService.getUserIdBySession("session-123")).thenReturn(userId);
        when(authService.isValidSession("session-123")).thenReturn(true);
        when(messageService.getMessagesByRoomId(roomId)).thenReturn(List.of(message1, message2));

        // Act & Assert
        mockMvc.perform(get("/api/messages?roomId=" + roomId)
                .cookie(new jakarta.servlet.http.Cookie("fm_session", "session-123")))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id").value(message1.getId().toString()))
                .andExpect(jsonPath("$[0].userId").value(userId.toString()))
                .andExpect(jsonPath("$[0].roomId").value(roomId))
                .andExpect(jsonPath("$[0].message").value("Hello, team!"))
                .andExpect(jsonPath("$[1].id").value(message2.getId().toString()))
                .andExpect(jsonPath("$[1].userId").value(userId.toString()))
                .andExpect(jsonPath("$[1].roomId").value(roomId))
                .andExpect(jsonPath("$[1].message").value("Looking forward to the meeting"));
    }

    @Test
    void createMessage_success() throws Exception {
        // Arrange
        var userId = UUID.randomUUID();

        var request = new CreateMessageRequest();
        request.setRoomId("project-123");
        request.setMessage("Hello from the API test!");

        var mockResponse = new MessageResponse();
        mockResponse.setId(UUID.randomUUID());
        mockResponse.setUserId(userId.toString());
        mockResponse.setRoomId(request.getRoomId());
        mockResponse.setMessage(request.getMessage());
        mockResponse.setCreatedAt(LocalDateTime.now());
        
        when(authService.getUserIdBySession("session-123")).thenReturn(userId);
        when(authService.isValidSession("session-123")).thenReturn(true);
        when(messageService.createMessage(request, userId)).thenReturn(mockResponse);

        // Act & Assert
        mockMvc.perform(post("/api/messages")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"roomId\":\"project-123\",\"message\":\"Hello from the API test!\"}")
                .cookie(new jakarta.servlet.http.Cookie("fm_session", "session-123")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(mockResponse.getId().toString()))
                .andExpect(jsonPath("$.userId").value(userId.toString()))
                .andExpect(jsonPath("$.roomId").value("project-123"))
                .andExpect(jsonPath("$.message").value("Hello from the API test!"));
    }
}