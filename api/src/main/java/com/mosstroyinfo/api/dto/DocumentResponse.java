package com.mosstroyinfo.api.dto;

import com.mosstroyinfo.api.model.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DocumentResponse {
    private UUID id;
    private String fileName;
    private String originalFileName;
    private String contentType;
    private Long fileSize;
    private UUID projectId;
    private String projectTitle;
    private Document.DocumentStatus status;
    private LocalDateTime uploadedAt;
}
