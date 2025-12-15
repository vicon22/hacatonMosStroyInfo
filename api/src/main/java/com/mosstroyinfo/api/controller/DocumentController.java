package com.mosstroyinfo.api.controller;

import com.mosstroyinfo.api.dto.DocumentResponse;
import com.mosstroyinfo.api.dto.StatusUpdateRequest;
import com.mosstroyinfo.api.service.AuthService;
import com.mosstroyinfo.api.service.DocumentService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

import static lombok.AccessLevel.PRIVATE;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@FieldDefaults(level = PRIVATE, makeFinal = true)
public class DocumentController {
    DocumentService documentService;
    AuthService authService;

    @PostMapping("/projects/{id}/docs")
    public ResponseEntity<?> uploadDocument(
            @PathVariable UUID id,
            @RequestParam("file") MultipartFile file,
            @CookieValue(value = "fm_session", required = false) String sessionId,
            Authentication authentication) {
        var userId = getUserId(sessionId, authentication);
        if (userId == null) {
            return ResponseEntity.status(401).body("{\"error\":\"Unauthorized\"}");
        }

        try {
            var document = documentService.uploadDocument(id, userId, file);
            return ResponseEntity.ok(document);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/docs")
    public ResponseEntity<List<DocumentResponse>> getUserDocuments(
            @CookieValue(value = "fm_session", required = false) String sessionId,
            Authentication authentication) {

        var userId = getUserId(sessionId, authentication);

        if (userId == null) {
            return ResponseEntity.status(401).build();
        }

        var documents = documentService.getUserDocuments(userId);
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/projects/{id}/docs")
    public ResponseEntity<List<DocumentResponse>> getProjectDocuments(
            @PathVariable UUID id,
            @CookieValue(value = "fm_session", required = false) String sessionId,
            Authentication authentication) {
        var userId = getUserId(sessionId, authentication);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }

        var documents = documentService.getProjectDocuments(id, userId);
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/docs/{id}")
    public ResponseEntity<Resource> downloadDocument(
            @PathVariable UUID id,
            @CookieValue(value = "fm_session", required = false) String sessionId,
            Authentication authentication) {
        var userId = getUserId(sessionId, authentication);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }

        try {
            var resource = documentService.downloadDocument(id, userId);
            var document = documentService.getDocumentMetadata(id, userId);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(document.getContentType()))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + document.getOriginalFileName() + "\"")
                    .body(resource);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).build();
        }
    }

    @DeleteMapping("/docs/{id}")
    public ResponseEntity<Void> deleteDocument(
            @PathVariable UUID id,
            @CookieValue(value = "fm_session", required = false) String sessionId,
            Authentication authentication) {
        var userId = getUserId(sessionId, authentication);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }

        try {
            documentService.deleteDocument(id, userId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).build();
        }
    }

    @PatchMapping("/docs/{id}/status")
    public ResponseEntity<DocumentResponse> updateDocumentStatus(
            @PathVariable UUID id,
            @RequestBody StatusUpdateRequest request,
            @CookieValue(value = "fm_session", required = false) String sessionId,
            Authentication authentication) {
        var userId = getUserId(sessionId, authentication);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }

        try {
            var document = documentService.updateDocumentStatus(id, userId, request.status());
            return ResponseEntity.ok(document);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).build();
        }
    }

    private UUID getUserId(String sessionId, Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof UUID) {
            var userId = (UUID) authentication.getPrincipal();
            return userId;
        }
        if (sessionId != null) {
            var userId = authService.getUserIdBySession(sessionId);
            return userId;
        }
        return null;
    }
}
