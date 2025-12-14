package com.mosstroyinfo.api.controller;

import com.mosstroyinfo.api.dto.DocumentResponse;
import com.mosstroyinfo.api.dto.StatusUpdateRequest;
import com.mosstroyinfo.api.model.Document;
import com.mosstroyinfo.api.service.AuthService;
import com.mosstroyinfo.api.service.DocumentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class DocumentController {
    private final DocumentService documentService;
    private final AuthService authService;

    @PostMapping("/projects/{id}/docs")
    public ResponseEntity<?> uploadDocument(
            @PathVariable UUID id,
            @RequestParam("file") MultipartFile file,
            @CookieValue(value = "fm_session", required = false) String sessionId,
            Authentication authentication) {
        log.info("POST /api/projects/{}/docs - File upload: name={}, size={} bytes, contentType={}", 
            id, file.getOriginalFilename(), file.getSize(), file.getContentType());
        UUID userId = getUserId(sessionId, authentication);
        if (userId == null) {
            log.warn("POST /api/projects/{}/docs - Unauthorized: no valid userId", id);
            return ResponseEntity.status(401).body("{\"error\":\"Unauthorized\"}");
        }

        log.info("POST /api/projects/{}/docs - userId: {}", id, userId);
        try {
            DocumentResponse document = documentService.uploadDocument(id, userId, file);
            log.info("POST /api/projects/{}/docs - Document uploaded successfully: {}", id, document.getId());
            return ResponseEntity.ok(document);
        } catch (RuntimeException e) {
            log.error("POST /api/projects/{}/docs - Error uploading document: {}", id, e.getMessage(), e);
            return ResponseEntity.status(400).body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/docs")
    public ResponseEntity<List<DocumentResponse>> getUserDocuments(
            @CookieValue(value = "fm_session", required = false) String sessionId,
            Authentication authentication) {
        log.info("GET /api/docs - Request to get user documents, sessionId: {}", 
            sessionId != null && sessionId.length() > 20 ? sessionId.substring(0, 20) + "..." : sessionId);
        UUID userId = getUserId(sessionId, authentication);

        if (userId == null) {
            log.warn("GET /api/docs - Unauthorized: no valid userId");
            return ResponseEntity.status(401).build();
        }

        log.info("GET /api/docs - userId: {}", userId);
        List<DocumentResponse> documents = documentService.getUserDocuments(userId);
        log.info("GET /api/docs - Returning {} documents for userId: {}", documents.size(), userId);
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/projects/{id}/docs")
    public ResponseEntity<List<DocumentResponse>> getProjectDocuments(
            @PathVariable UUID id,
            @CookieValue(value = "fm_session", required = false) String sessionId,
            Authentication authentication) {
        log.info("GET /api/projects/{}/docs - Request to get project documents", id);
        UUID userId = getUserId(sessionId, authentication);
        if (userId == null) {
            log.warn("GET /api/projects/{}/docs - Unauthorized: no valid userId", id);
            return ResponseEntity.status(401).build();
        }

        log.info("GET /api/projects/{}/docs - userId: {}", id, userId);
        List<DocumentResponse> documents = documentService.getProjectDocuments(id, userId);
        log.info("GET /api/projects/{}/docs - Returning {} documents for project {} and userId: {}", 
            id, documents.size(), id, userId);
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/docs/{id}")
    public ResponseEntity<Resource> downloadDocument(
            @PathVariable UUID id,
            @CookieValue(value = "fm_session", required = false) String sessionId,
            Authentication authentication) {
        log.info("GET /api/docs/{} - Request to download document", id);
        UUID userId = getUserId(sessionId, authentication);
        if (userId == null) {
            log.warn("GET /api/docs/{} - Unauthorized: no valid userId", id);
            return ResponseEntity.status(401).build();
        }

        log.info("GET /api/docs/{} - userId: {}", id, userId);
        try {
            Resource resource = documentService.downloadDocument(id, userId);
            Document document = documentService.getDocumentMetadata(id, userId);
            log.info("GET /api/docs/{} - Document found: {} ({}), contentType: {}", 
                id, document.getOriginalFileName(), document.getContentType());

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(document.getContentType()))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + document.getOriginalFileName() + "\"")
                    .body(resource);
        } catch (RuntimeException e) {
            log.error("GET /api/docs/{} - Error downloading document: {}", id, e.getMessage(), e);
            return ResponseEntity.status(404).build();
        }
    }

    @DeleteMapping("/docs/{id}")
    public ResponseEntity<Void> deleteDocument(
            @PathVariable UUID id,
            @CookieValue(value = "fm_session", required = false) String sessionId,
            Authentication authentication) {
        log.info("DELETE /api/docs/{} - Request to delete document", id);
        UUID userId = getUserId(sessionId, authentication);
        if (userId == null) {
            log.warn("DELETE /api/docs/{} - Unauthorized: no valid userId", id);
            return ResponseEntity.status(401).build();
        }

        log.info("DELETE /api/docs/{} - userId: {}", id, userId);
        try {
            documentService.deleteDocument(id, userId);
            log.info("DELETE /api/docs/{} - Document deleted successfully", id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            log.error("DELETE /api/docs/{} - Error deleting document: {}", id, e.getMessage(), e);
            return ResponseEntity.status(404).build();
        }
    }

    @PatchMapping("/docs/{id}/status")
    public ResponseEntity<DocumentResponse> updateDocumentStatus(
            @PathVariable UUID id,
            @RequestBody StatusUpdateRequest request,
            @CookieValue(value = "fm_session", required = false) String sessionId,
            Authentication authentication) {
        log.info("PATCH /api/docs/{}/status - Request to update document status to: {}", id, request.getStatus());
        UUID userId = getUserId(sessionId, authentication);
        if (userId == null) {
            log.warn("PATCH /api/docs/{}/status - Unauthorized: no valid userId", id);
            return ResponseEntity.status(401).build();
        }

        log.info("PATCH /api/docs/{}/status - userId: {}", id, userId);
        try {
            DocumentResponse document = documentService.updateDocumentStatus(id, userId, request.getStatus());
            log.info("PATCH /api/docs/{}/status - Document status updated successfully: {}", id, document.getStatus());
            return ResponseEntity.ok(document);
        } catch (RuntimeException e) {
            log.error("PATCH /api/docs/{}/status - Error updating document status: {}", id, e.getMessage(), e);
            return ResponseEntity.status(404).build();
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
