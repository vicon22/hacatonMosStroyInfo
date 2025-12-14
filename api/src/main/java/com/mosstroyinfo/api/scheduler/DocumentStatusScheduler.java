package com.mosstroyinfo.api.scheduler;

import com.mosstroyinfo.api.model.Document;
import com.mosstroyinfo.api.repository.DocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DocumentStatusScheduler {
    private final DocumentRepository documentRepository;

    @Scheduled(fixedDelay = 5000)
    public void autoApproveDocuments() {
        LocalDateTime fiveSecondsAgo = LocalDateTime.now().minusSeconds(5);

        List<Document> documentsToApprove = documentRepository.findAll().stream()
                .filter(doc -> doc.getStatus() == Document.DocumentStatus.ON_REVIEW)
                .filter(doc -> doc.getStatusChangedAt() != null)
                .filter(doc -> doc.getStatusChangedAt().isBefore(fiveSecondsAgo))
                .toList();

        for (Document document : documentsToApprove) {
            document.setStatus(Document.DocumentStatus.REVIEWED);
            document.setStatusChangedAt(LocalDateTime.now());
            documentRepository.save(document);
        }
    }
}
