package com.ltc.NeuroHire.cv;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CVDocumentRepository extends JpaRepository<CVDocument, Long> {
    List<CVDocument> findByCandidateUserIdOrderByCreatedAtDesc(Long userId);
}
