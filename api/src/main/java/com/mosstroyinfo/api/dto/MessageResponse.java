package com.mosstroyinfo.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse {
    private UUID id;
    private String userId;
    private String roomId;
    private String message;
    private LocalDateTime createdAt;
}

