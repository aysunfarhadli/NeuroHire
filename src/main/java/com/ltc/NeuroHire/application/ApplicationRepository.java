package com.ltc.NeuroHire.application;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    Optional<Application> findByCandidateUserIdAndJobId(Long candidateUserId, Long jobId);
    List<Application> findByCandidateUserIdOrderByCreatedAtDesc(Long candidateUserId);
    List<Application> findByJobIdOrderByCreatedAtDesc(Long jobId);
    boolean existsByCandidateUserIdAndJobId(Long candidateUserId, Long jobId);
}
