package com.mosstroyinfo.api.dto;

import com.mosstroyinfo.api.model.Document;

import java.time.LocalDateTime;
import java.util.UUID;

public record DocumentResponse (
    UUID id,
    String fileName,
    String originalFileName,
    String contentType,
    Long fileSize,
    UUID projectId,
    String projectTitle,
    Document.DocumentStatus status,
    LocalDateTime uploadedAt
) {}