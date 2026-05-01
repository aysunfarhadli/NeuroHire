package com.ltc.NeuroHire.job;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface JobAnalysisRepository extends JpaRepository<JobAnalysis, Long> {
    Optional<JobAnalysis> findFirstByJobIdOrderByCreatedAtDesc(Long jobId);
}
