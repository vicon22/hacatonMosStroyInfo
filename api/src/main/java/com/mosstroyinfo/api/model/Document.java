package com.mosstroyinfo.api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

import static lombok.AccessLevel.PRIVATE;

@Entity
@Table(name = "documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = PRIVATE)
public class Document {
    @Id
    @UuidGenerator
    UUID id;

    @Column(nullable = false)
    String fileName;

    @Column(nullable = false)
    String originalFileName;

    @Column(nullable = false)
    String contentType;

    @Column(nullable = false)
    Long fileSize;

    @Column(nullable = false)
    String filePath;

    @Column(name = "project_id", nullable = false)
    UUID projectId;

    @Column(name = "user_id", nullable = false)
    UUID userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    DocumentStatus status = DocumentStatus.NEW;

    @Column(name = "status_changed_at")
    LocalDateTime statusChangedAt;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    LocalDateTime uploadedAt;

    public enum DocumentStatus {
        NEW, // новое
        ON_REVIEW, // на проверке
        REVIEWED // проверено
    }
}
