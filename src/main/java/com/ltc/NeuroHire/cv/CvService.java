package com.ltc.NeuroHire.cv;

import com.ltc.NeuroHire.common.enums.ParsingStatus;
import com.ltc.NeuroHire.common.exception.ApiException;
import com.ltc.NeuroHire.cv.dto.CvDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CvService {

    private final CVDocumentRepository repo;
    private final CvStorageService storage;
    private final CvParserService parser;

    @Transactional
    public CvDto.UploadResponse upload(Long candidateUserId, MultipartFile file) {
        CvStorageService.StoredFile stored = storage.store(file);

        CVDocument doc = CVDocument.builder()
                .candidateUserId(candidateUserId)
                .fileName(stored.originalName() != null ? stored.originalName() : "cv")
                .contentType(stored.contentType() != null ? stored.contentType() : "application/octet-stream")
                .fileUrl(stored.url())
                .fileSize(stored.size())
                .parsingStatus(ParsingStatus.PENDING)
                .build();
        doc = repo.save(doc);

        parseAsync(doc.getId(), stored.path());

        return new CvDto.UploadResponse(
                doc.getId(), doc.getFileName(), doc.getContentType(),
                doc.getFileSize(), doc.getParsingStatus(), doc.getCreatedAt()
        );
    }

    @Async
    public void parseAsync(Long cvId, Path filePath) {
        try {
            CVDocument doc = repo.findById(cvId).orElse(null);
            if (doc == null) return;
            doc.setParsingStatus(ParsingStatus.PROCESSING);
            repo.save(doc);

            String text = parser.extractText(filePath, doc.getContentType(), doc.getFileName());
            doc.setExtractedText(text);
            doc.setParsingStatus(ParsingStatus.DONE);
            repo.save(doc);
        } catch (Exception ex) {
            log.error("Async CV parsing failed for id={}", cvId, ex);
            repo.findById(cvId).ifPresent(d -> {
                d.setParsingStatus(ParsingStatus.FAILED);
                d.setParsingError(ex.getMessage());
                repo.save(d);
            });
        }
    }

    @Transactional(readOnly = true)
    public List<CvDto.CvSummary> listForCandidate(Long candidateUserId) {
        return repo.findByCandidateUserIdOrderByCreatedAtDesc(candidateUserId).stream()
                .map(d -> new CvDto.CvSummary(
                        d.getId(), d.getFileName(), d.getFileSize(),
                        d.getParsingStatus(), d.getParsingError(), d.getCreatedAt()
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public CvDto.CvDetail get(Long id) {
        CVDocument d = repo.findById(id).orElseThrow(() -> ApiException.notFound("CV not found"));
        return new CvDto.CvDetail(
                d.getId(), d.getFileName(), d.getContentType(), d.getFileSize(),
                d.getParsingStatus(), d.getParsingError(), d.getExtractedText(),
                d.getCreatedAt(), d.getUpdatedAt()
        );
    }

    @Transactional
    public void delete(Long id) {
        if (!repo.existsById(id)) throw ApiException.notFound("CV not found");
        repo.deleteById(id);
    }

    @Transactional(readOnly = true)
    public CVDocument requireDocument(Long id) {
        return repo.findById(id).orElseThrow(() -> ApiException.notFound("CV not found"));
    }
}
