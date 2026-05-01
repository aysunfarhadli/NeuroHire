package com.ltc.NeuroHire.job;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobPostRepository extends JpaRepository<JobPost, Long> {
    List<JobPost> findByCompanyIdOrderByCreatedAtDesc(Long companyId);
    List<JobPost> findByStatusOrderByCreatedAtDesc(String status);
}
