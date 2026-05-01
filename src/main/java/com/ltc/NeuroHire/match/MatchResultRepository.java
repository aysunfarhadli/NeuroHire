package com.ltc.NeuroHire.match;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MatchResultRepository extends JpaRepository<MatchResult, Long> {
    Optional<MatchResult> findByCvIdAndJobId(Long cvId, Long jobId);
    List<MatchResult> findByJobIdOrderByTotalScoreDesc(Long jobId);
}
