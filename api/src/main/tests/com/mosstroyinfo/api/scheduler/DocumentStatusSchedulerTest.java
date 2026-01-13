package com.mosstroyinfo.api.scheduler;

import com.mosstroyinfo.api.model.Document;
import com.mosstroyinfo.api.repository.DocumentRepository;
import com.mosstroyinfo.api.scheduler.DocumentStatusScheduler;
import lombok.experimental.FieldDefaults;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static lombok.AccessLevel.PRIVATE;
import static org.mockito.Mockito.*;

@SpringBootTest
@FieldDefaults(level = PRIVATE)
class DocumentStatusSchedulerTest {

    @Autowired
    DocumentStatusScheduler documentStatusScheduler;

    @MockBean
    DocumentRepository documentRepository;

    @Test
    void autoApproveDocuments_noDocumentsToApprove() {
        // Arrange
        when(documentRepository.findAll()).thenReturn(List.of());

        // Act
        documentStatusScheduler.autoApproveDocuments();

        // Assert
        verify(documentRepository).findAll();
        verifyNoMoreInteractions(documentRepository);
    }

    @Test
    void autoApproveDocuments_noDocumentsInOnReviewStatus() {
        // Arrange
        var documentId = UUID.randomUUID();

        var document = new Document();
        document.setId(documentId);
        document.setStatus(Document.DocumentStatus.NEW);
        document.setStatusChangedAt(LocalDateTime.now().minusSeconds(10));

        
        when(documentRepository.findAll()).thenReturn(List.of(document));

        // Act
        documentStatusScheduler.autoApproveDocuments();

        // Assert
        verify(documentRepository, never()).save(any(Document.class));
    }

    @Test
    void autoApproveDocuments_documentInOnReviewStatusButNotOldEnough() {
        // Arrange
        var documentId = UUID.randomUUID();

        var document = new Document();
        document.setId(documentId);
        document.setStatus(Document.DocumentStatus.ON_REVIEW);
        document.setStatusChangedAt(LocalDateTime.now().minusSeconds(3));

        when(documentRepository.findAll()).thenReturn(List.of(document));

        // Act
        documentStatusScheduler.autoApproveDocuments();

        // Assert
        verify(documentRepository, never()).save(any(Document.class));
    }

    @Test
    void autoApproveDocuments_documentInOnReviewStatusAndOldEnough() {
        // Arrange
        var documentId = UUID.randomUUID();

        var document = new Document();
        document.setId(documentId);
        document.setStatus(Document.DocumentStatus.ON_REVIEW);
        document.setStatusChangedAt(LocalDateTime.now().minusSeconds(10));

        when(documentRepository.findAll()).thenReturn(List.of(document));

        // Act
        documentStatusScheduler.autoApproveDocuments();

        // Assert
        verify(documentRepository).findAll();
        verify(documentRepository).save(argThat(savedDoc -> 
            savedDoc.getId().equals(documentId) &&
            savedDoc.getStatus() == Document.DocumentStatus.REVIEWED
        ));
    }

    @Test
    void autoApproveDocuments_multipleDocumentsWithMixedConditions() {
        // Arrange
        var documentId1 = UUID.randomUUID();
        var documentId2 = UUID.randomUUID();
        var documentId3 = UUID.randomUUID();

        var document1 = new Document();
        document1.setId(documentId1);
        document1.setStatus(Document.DocumentStatus.ON_REVIEW);
        document1.setStatusChangedAt(LocalDateTime.now().minusSeconds(10));

        var document2 = new Document();
        document2.setId(documentId2);
        document2.setStatus(Document.DocumentStatus.NEW);
        document2.setStatusChangedAt(LocalDateTime.now().minusSeconds(10));

        var document3 = new Document();
        document3.setId(documentId3);
        document3.setStatus(Document.DocumentStatus.ON_REVIEW);
        document3.setStatusChangedAt(LocalDateTime.now().minusSeconds(3));

        when(documentRepository.findAll()).thenReturn(List.of(document1, document2, document3));

        // Act
        documentStatusScheduler.autoApproveDocuments();

        // Assert
        verify(documentRepository, times(2)).findAll();

        verify(documentRepository).save(argThat(savedDoc -> 
            savedDoc.getId().equals(documentId1) &&
            savedDoc.getStatus() == Document.DocumentStatus.REVIEWED
        ));
        verify(documentRepository, never()).save(argThat(savedDoc -> 
            savedDoc.getId().equals(documentId2)
        ));
        verify(documentRepository, never()).save(argThat(savedDoc -> 
            savedDoc.getId().equals(documentId3)
        ));
    }
}