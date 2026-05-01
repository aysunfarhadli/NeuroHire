package com.ltc.NeuroHire.ai;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CVAnalysisRepository extends JpaRepository<CVAnalysis, Long> {
    Optional<CVAnalysis> findFirstByCvIdAndJobIdOrderByCreatedAtDesc(Long cvId, Long jobId);
    Optional<CVAnalysis> findFirstByCvIdOrderByCreatedAtDesc(Long cvId);
    List<CVAnalysis> findByJobIdOrderByMatchScoreDesc(Long jobId);
}
