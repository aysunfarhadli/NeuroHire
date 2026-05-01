package com.ltc.NeuroHire.job.dto;

import com.ltc.NeuroHire.common.enums.CandidateLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.util.List;

public class JobDto {

    public record CreateRequest(
            @NotBlank @Size(max = 200) String title,
            @NotBlank String description,
            CandidateLevel seniority,
            @Size(max = 200) String location,
            @Size(max = 50) String employmentType
    ) {}

    public record UpdateRequest(
            @Size(max = 200) String title,
            String description,
            CandidateLevel seniority,
            @Size(max = 200) String location,
            @Size(max = 50) String employmentType,
            @Size(max = 30) String status
    ) {}

    public record Response(
            Long id, Long companyId, Long createdByUserId,
            String title, String description, CandidateLevel seniority,
            String location, String employmentType, String status,
            Instant createdAt, Instant updatedAt
    ) {}

    public record AnalysisResponse(
            Long id, Long jobId,
            List<String> mustHaveSkills,
            List<String> niceToHaveSkills,
            List<String> responsibilities,
            CandidateLevel seniority,
            String domain,
            Integer minYearsExperience
    ) {}
}
