package com.mosstroyinfo.api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static lombok.AccessLevel.PRIVATE;

@Entity
@Table(name = "projects")
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = PRIVATE)
public class Project {
    @Id
    UUID id;

    @Column(nullable = false)
    String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    ProjectStatus status;

    @Column(name = "blueprint_id", nullable = false)
    UUID blueprintId;

    @Column(name = "user_id", nullable = false)
    UUID userId;

    @ElementCollection
    @CollectionTable(name = "project_documents", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "document_url")
    List<String> documents = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "project_streams", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "stream_url")
    List<String> streamUrls = new ArrayList<>();

    public enum ProjectStatus {
        NEW, approval, pending, completed;

        public String toApiValue() {
            return this == NEW ? "new" : name();
        }
    }
}
