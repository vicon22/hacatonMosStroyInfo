package com.mosstroyinfo.api.service;

import com.mosstroyinfo.api.dto.DocumentResponse;
import com.mosstroyinfo.api.model.Document;
import com.mosstroyinfo.api.model.Project;
import com.mosstroyinfo.api.repository.DocumentRepository;
import com.mosstroyinfo.api.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DocumentService {
    private final DocumentRepository documentRepository;
    private final ProjectRepository projectRepository;

    @Value("${document.upload.dir:./uploads}")
    private String uploadDir;

    public DocumentResponse uploadDocument(UUID projectId, UUID userId, MultipartFile file) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (!project.getUserId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }

        try {
            // Создаем директорию если её нет
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Генерируем уникальное имя файла
            String originalFileName = file.getOriginalFilename();
            String fileName = UUID.randomUUID().toString() + "_" + originalFileName;
            Path filePath = uploadPath.resolve(fileName);

            // Сохраняем файл
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Создаем запись в БД
            Document document = new Document();
            document.setFileName(fileName);
            document.setOriginalFileName(originalFileName);
            document.setContentType(file.getContentType());
            document.setFileSize(file.getSize());
            document.setFilePath(filePath.toString());
            document.setProjectId(projectId);
            document.setUserId(userId);

            document = documentRepository.save(document);

            return toResponse(document);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }

    public List<DocumentResponse> getUserDocuments(UUID userId) {
        return documentRepository.findByUserId(userId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<DocumentResponse> getProjectDocuments(UUID projectId, UUID userId) {
        return documentRepository.findByProjectIdAndUserId(projectId, userId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public Resource downloadDocument(UUID documentId, UUID userId) {
        Document document = documentRepository.findByIdAndUserId(documentId, userId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        try {
            Path filePath = Paths.get(document.getFilePath());
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("File not found or not readable");
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to load file", e);
        }
    }

    public Document getDocumentMetadata(UUID documentId, UUID userId) {
        return documentRepository.findByIdAndUserId(documentId, userId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
    }

    public void deleteDocument(UUID documentId, UUID userId) {
        Document document = documentRepository.findByIdAndUserId(documentId, userId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        // Удаляем файл с диска
        try {
            Path filePath = Paths.get(document.getFilePath());
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            // Логируем ошибку, но продолжаем удаление из БД
            System.err.println("Failed to delete file: " + e.getMessage());
        }

        // Удаляем запись из БД
        documentRepository.delete(document);
    }

    public DocumentResponse updateDocumentStatus(UUID documentId, UUID userId, Document.DocumentStatus status) {
        Document document = documentRepository.findByIdAndUserId(documentId, userId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        document.setStatus(status);
        document.setStatusChangedAt(java.time.LocalDateTime.now());
        document = documentRepository.save(document);

        return toResponse(document);
    }

    private DocumentResponse toResponse(Document document) {
        // Получаем название проекта
        String projectTitle = projectRepository.findById(document.getProjectId())
                .map(Project::getTitle)
                .orElse("Unknown");

        return new DocumentResponse(
                document.getId(),
                document.getFileName(),
                document.getOriginalFileName(),
                document.getContentType(),
                document.getFileSize(),
                document.getProjectId(),
                projectTitle,
                document.getStatus(),
                document.getUploadedAt());
    }
}
