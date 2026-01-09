package com.mosstroyinfo.api.controller;

import com.mosstroyinfo.api.dto.CreateMessageRequest;
import com.mosstroyinfo.api.dto.MessageResponse;
import com.mosstroyinfo.api.service.AuthService;
import com.mosstroyinfo.api.service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {
    private final MessageService messageService;
    private final AuthService authService;

    @GetMapping
    public ResponseEntity<List<MessageResponse>> getMessages(
            @RequestParam String roomId,
            @CookieValue(value = "fm_session", required = false) String sessionId,
            Authentication authentication) {
        log.info("GET /api/messages?roomId={} - sessionId: {}, authentication: {}", 
            roomId,
            sessionId != null && sessionId.length() > 20 ? sessionId.substring(0, 20) + "..." : sessionId,
            authentication != null ? authentication.getName() : "null");
        
        UUID userId = getUserId(sessionId, authentication);
        if (userId == null) {
            log.warn("GET /api/messages?roomId={} - Unauthorized: no valid userId", roomId);
            return ResponseEntity.status(401).build();
        }

        log.info("GET /api/messages?roomId={} - userId: {}", roomId, userId);
        List<MessageResponse> messages = messageService.getMessagesByRoomId(roomId);
        log.info("GET /api/messages?roomId={} - returning {} messages", roomId, messages.size());
        return ResponseEntity.ok(messages);
    }

    @PostMapping
    public ResponseEntity<MessageResponse> createMessage(
            @RequestBody @Valid CreateMessageRequest request,
            @CookieValue(value = "fm_session", required = false) String sessionId,
            Authentication authentication) {
        log.info("POST /api/messages - roomId: {}, sessionId: {}, authentication: {}", 
            request.getRoomId(),
            sessionId != null && sessionId.length() > 20 ? sessionId.substring(0, 20) + "..." : sessionId,
            authentication != null ? authentication.getName() : "null");
        
        UUID userId = getUserId(sessionId, authentication);
        if (userId == null) {
            log.warn("POST /api/messages - Unauthorized: no valid userId");
            return ResponseEntity.status(401).body(null);
        }

        log.info("POST /api/messages - userId: {}", userId);
        try {
            MessageResponse message = messageService.createMessage(request, userId);
            log.info("POST /api/messages - Message created successfully: {}", message.getId());
            return ResponseEntity.ok(message);
        } catch (RuntimeException e) {
            log.error("POST /api/messages - Error: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(null);
        }
    }

    private UUID getUserId(String sessionId, Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof UUID) {
            UUID userId = (UUID) authentication.getPrincipal();
            log.debug("getUserId: using authentication principal: {}", userId);
            return userId;
        }
        if (sessionId != null) {
            UUID userId = authService.getUserIdBySession(sessionId);
            log.debug("getUserId: using sessionId, result: {}", userId);
            return userId;
        }
        log.debug("getUserId: no authentication and no sessionId");
        return null;
    }
}

