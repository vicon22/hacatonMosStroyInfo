package com.mosstroyinfo.api.repository;

import com.mosstroyinfo.api.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DocumentRepository extends JpaRepository<Document, UUID> {
    List<Document> findByUserId(UUID userId);

    List<Document> findByProjectId(UUID projectId);

    Optional<Document> findByIdAndUserId(UUID id, UUID userId);

    List<Document> findByProjectIdAndUserId(UUID projectId, UUID userId);
}
