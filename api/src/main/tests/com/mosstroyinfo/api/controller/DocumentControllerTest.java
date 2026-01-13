package com.mosstroyinfo.api.controller;

import com.mosstroyinfo.api.dto.DocumentResponse;
import com.mosstroyinfo.api.dto.StatusUpdateRequest;
import com.mosstroyinfo.api.model.Document;
import com.mosstroyinfo.api.service.AuthService;
import com.mosstroyinfo.api.service.DocumentService;
import lombok.experimental.FieldDefaults;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static lombok.AccessLevel.PRIVATE;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@FieldDefaults(level = PRIVATE)
class DocumentControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockBean
    AuthService authService;
    @MockBean
    DocumentService documentService;


    @Test
    void uploadDocument_success() throws Exception {
        // Arrange
        var projectId = UUID.randomUUID();
        var userId = UUID.randomUUID();
        var file = new MockMultipartFile(
                "file",
                "test.pdf",
                "application/pdf",
                "Test file content".getBytes()
        );

        var mockResponse = new DocumentResponse();
        mockResponse.setId(UUID.randomUUID());
        mockResponse.setFileName("test.pdf");
        mockResponse.setOriginalFileName("test.pdf");
        mockResponse.setContentType("application/pdf");
        mockResponse.setFileSize(15L);
        mockResponse.setProjectId(projectId);
        mockResponse.setProjectTitle("Test Project");
        mockResponse.setStatus(Document.DocumentStatus.NEW);
        mockResponse.setUploadedAt(LocalDateTime.now());
        
        when(authService.getUserIdBySession("session-123")).thenReturn(userId);
        when(authService.isValidSession("session-123")).thenReturn(true);
        when(documentService.uploadDocument(projectId, userId, file)).thenReturn(mockResponse);

        // Act & Assert
        mockMvc.perform(multipart("/api/projects/" + projectId + "/docs")
                .file(file)
                .cookie(new jakarta.servlet.http.Cookie("fm_session", "session-123")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.fileName").value("test.pdf"))
                .andExpect(jsonPath("$.originalFileName").value("test.pdf"))
                .andExpect(jsonPath("$.contentType").value("application/pdf"))
                .andExpect(jsonPath("$.fileSize").value(15))
                .andExpect(jsonPath("$.projectId").value(projectId.toString()))
                .andExpect(jsonPath("$.projectTitle").value("Test Project"))
                .andExpect(jsonPath("$.status").value("NEW"));
    }

    @Test
    void getUserDocuments_success() throws Exception {
        // Arrange
        var userId = UUID.randomUUID();

        var doc1 = new DocumentResponse();
        doc1.setId(UUID.randomUUID());
        doc1.setFileName("doc1.pdf");
        doc1.setOriginalFileName("document1.pdf");
        doc1.setContentType("application/pdf");
        doc1.setFileSize(1000L);
        doc1.setProjectId(UUID.randomUUID());
        doc1.setProjectTitle("Project A");
        doc1.setStatus(Document.DocumentStatus.NEW);
        doc1.setUploadedAt(LocalDateTime.now().minusDays(1));

        var doc2 = new DocumentResponse();
        doc2.setId(UUID.randomUUID());
        doc2.setFileName("doc2.pdf");
        doc2.setOriginalFileName("document2.pdf");
        doc2.setContentType("application/pdf");
        doc2.setFileSize(2000L);
        doc2.setProjectId(UUID.randomUUID());
        doc2.setProjectTitle("Project B");
        doc2.setStatus(Document.DocumentStatus.ON_REVIEW);
        doc2.setUploadedAt(LocalDateTime.now());
        
        when(authService.getUserIdBySession("session-123")).thenReturn(userId);
        when(authService.isValidSession("session-123")).thenReturn(true);
        when(documentService.getUserDocuments(userId)).thenReturn(List.of(doc1, doc2));

        // Act & Assert
        mockMvc.perform(get("/api/docs")
                .cookie(new jakarta.servlet.http.Cookie("fm_session", "session-123")))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id").value(doc1.getId().toString()))
                .andExpect(jsonPath("$[0].fileName").value("doc1.pdf"))
                .andExpect(jsonPath("$[0].originalFileName").value("document1.pdf"))
                .andExpect(jsonPath("$[0].contentType").value("application/pdf"))
                .andExpect(jsonPath("$[0].fileSize").value(1000))
                .andExpect(jsonPath("$[0].projectId").value(doc1.getProjectId().toString()))
                .andExpect(jsonPath("$[0].projectTitle").value("Project A"))
                .andExpect(jsonPath("$[0].status").value("NEW"))
                .andExpect(jsonPath("$[1].id").value(doc2.getId().toString()))
                .andExpect(jsonPath("$[1].fileName").value("doc2.pdf"))
                .andExpect(jsonPath("$[1].originalFileName").value("document2.pdf"))
                .andExpect(jsonPath("$[1].contentType").value("application/pdf"))
                .andExpect(jsonPath("$[1].fileSize").value(2000))
                .andExpect(jsonPath("$[1].projectId").value(doc2.getProjectId().toString()))
                .andExpect(jsonPath("$[1].projectTitle").value("Project B"))
                .andExpect(jsonPath("$[1].status").value("ON_REVIEW"));
    }

    @Test
    void getProjectDocuments_success() throws Exception {
        // Arrange
        var projectId = UUID.randomUUID();
        var userId = UUID.randomUUID();

        var doc1 = new DocumentResponse();
        doc1.setId(UUID.randomUUID());
        doc1.setFileName("doc1.pdf");
        doc1.setOriginalFileName("document1.pdf");
        doc1.setContentType("application/pdf");
        doc1.setFileSize(1000L);
        doc1.setProjectId(projectId);
        doc1.setProjectTitle("Test Project");
        doc1.setStatus(Document.DocumentStatus.NEW);
        doc1.setUploadedAt(LocalDateTime.now().minusDays(1));

        var doc2 = new DocumentResponse();
        doc2.setId(UUID.randomUUID());
        doc2.setFileName("doc2.pdf");
        doc2.setOriginalFileName("document2.pdf");
        doc2.setContentType("application/pdf");
        doc2.setFileSize(2000L);
        doc2.setProjectId(projectId);
        doc2.setProjectTitle("Test Project");
        doc2.setStatus(Document.DocumentStatus.ON_REVIEW);
        doc2.setUploadedAt(LocalDateTime.now());
        
        when(authService.getUserIdBySession("session-123")).thenReturn(userId);
        when(authService.isValidSession("session-123")).thenReturn(true);
        when(documentService.getProjectDocuments(projectId, userId)).thenReturn(List.of(doc1, doc2));

        // Act & Assert
        mockMvc.perform(get("/api/projects/" + projectId + "/docs")
                .cookie(new jakarta.servlet.http.Cookie("fm_session", "session-123")))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id").value(doc1.getId().toString()))
                .andExpect(jsonPath("$[0].fileName").value("doc1.pdf"))
                .andExpect(jsonPath("$[0].originalFileName").value("document1.pdf"))
                .andExpect(jsonPath("$[0].contentType").value("application/pdf"))
                .andExpect(jsonPath("$[0].fileSize").value(1000))
                .andExpect(jsonPath("$[0].projectId").value(projectId.toString()))
                .andExpect(jsonPath("$[0].projectTitle").value("Test Project"))
                .andExpect(jsonPath("$[0].status").value("NEW"))
                .andExpect(jsonPath("$[1].id").value(doc2.getId().toString()))
                .andExpect(jsonPath("$[1].fileName").value("doc2.pdf"))
                .andExpect(jsonPath("$[1].originalFileName").value("document2.pdf"))
                .andExpect(jsonPath("$[1].contentType").value("application/pdf"))
                .andExpect(jsonPath("$[1].fileSize").value(2000))
                .andExpect(jsonPath("$[1].projectId").value(projectId.toString()))
                .andExpect(jsonPath("$[1].projectTitle").value("Test Project"))
                .andExpect(jsonPath("$[1].status").value("ON_REVIEW"));
    }

    @Test
    void downloadDocument_success() throws Exception {
        // Arrange
        var documentId = UUID.randomUUID();
        var userId = UUID.randomUUID();

        var mockDocument = new com.mosstroyinfo.api.model.Document();
        mockDocument.setOriginalFileName("test.pdf");
        mockDocument.setContentType("application/pdf");
        
        when(authService.getUserIdBySession("session-123")).thenReturn(userId);
        when(authService.isValidSession("session-123")).thenReturn(true);
        when(documentService.getDocumentMetadata(documentId, userId)).thenReturn(mockDocument);
        
        // Act & Assert
        mockMvc.perform(get("/api/docs/" + documentId)
                .cookie(new jakarta.servlet.http.Cookie("fm_session", "session-123")))
                .andExpect(status().isOk())
                .andExpect(header().exists(HttpHeaders.CONTENT_DISPOSITION))
                .andExpect(header().string(HttpHeaders.CONTENT_DISPOSITION, 
                    "attachment; filename=\"test.pdf\""))
                .andExpect(header().string(HttpHeaders.CONTENT_TYPE, "application/pdf"));
    }

    @Test
    void deleteDocument_success() throws Exception {
        // Arrange
        var documentId = UUID.randomUUID();
        var userId = UUID.randomUUID();
        
        when(authService.getUserIdBySession("session-123")).thenReturn(userId);
        when(authService.isValidSession("session-123")).thenReturn(true);

        // Act & Assert
        mockMvc.perform(delete("/api/docs/" + documentId)
                .cookie(new jakarta.servlet.http.Cookie("fm_session", "session-123")))
                .andExpect(status().isOk());
        

        verify(documentService).deleteDocument(documentId, userId);
    }

    @Test
    void updateDocumentStatus_success() throws Exception {
        // Arrange
        var documentId = UUID.randomUUID();
        var userId = UUID.randomUUID();

        var request = new StatusUpdateRequest();
        request.setStatus(Document.DocumentStatus.ON_REVIEW);

        var mockResponse = new DocumentResponse();
        mockResponse.setId(documentId);
        mockResponse.setFileName("test.pdf");
        mockResponse.setProjectTitle("Test Project");
        mockResponse.setStatus(Document.DocumentStatus.ON_REVIEW);
        mockResponse.setUploadedAt(LocalDateTime.now());
        
        when(authService.getUserIdBySession("session-123")).thenReturn(userId);
        when(authService.isValidSession("session-123")).thenReturn(true);
        when(documentService.updateDocumentStatus(documentId, userId, Document.DocumentStatus.ON_REVIEW))
                .thenReturn(mockResponse);

        // Act & Assert
        mockMvc.perform(patch("/api/docs/" + documentId + "/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"status\":\"ON_REVIEW\"}")
                .cookie(new jakarta.servlet.http.Cookie("fm_session", "session-123")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(documentId.toString()))
                .andExpect(jsonPath("$.status").value("ON_REVIEW"));
    }
    
}