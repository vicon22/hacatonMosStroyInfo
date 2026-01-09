package com.mosstroyinfo.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateMessageRequest {
    @NotBlank(message = "Room ID is required")
    private String roomId;

    @NotBlank(message = "Message text is required")
    private String message;
}

