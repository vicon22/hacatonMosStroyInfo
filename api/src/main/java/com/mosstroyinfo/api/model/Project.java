package com.mosstroyinfo.api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UuidGenerator;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "projects")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Project {
    @Id
    @UuidGenerator
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProjectStatus status;

    @Column(name = "blueprint_id", nullable = false)
    private UUID blueprintId;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @ElementCollection
    @CollectionTable(name = "project_documents", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "document_url")
    private List<String> documents = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "project_streams", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "stream_url")
    private List<String> streamUrls = new ArrayList<>();

    public enum ProjectStatus {
        NEW, approval, pending, completed;

        public String toApiValue() {
            return this == NEW ? "new" : name();
        }
    }
}

