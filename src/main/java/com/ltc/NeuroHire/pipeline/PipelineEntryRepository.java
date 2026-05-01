package com.ltc.NeuroHire.pipeline;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PipelineEntryRepository extends JpaRepository<PipelineEntry, Long> {
    Optional<PipelineEntry> findByJobIdAndCandidateUserId(Long jobId, Long candidateUserId);
    List<PipelineEntry> findByJobIdOrderByUpdatedAtDesc(Long jobId);
}
