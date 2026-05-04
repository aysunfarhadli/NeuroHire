package com.ltc.NeuroHire.application.dto;

import com.ltc.NeuroHire.common.enums.PipelineStageType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.Instant;

public class ApplicationDto {

    public record CreateRequest(
            @NotNull Long jobId,
            Long cvId,
            @Size(max = 4000) String coverLetter,
            @Size(max = 30) String source
    ) {}

    public record Response(
            Long id,
            Long candidateUserId,
            Long jobId,
            Long cvId,
            PipelineStageType stage,
            String coverLetter,
            String source,
            Instant appliedAt
    ) {}

    public record CandidateView(
            Long id,
            Long jobId,
            String jobTitle,
            String companyName,
            PipelineStageType stage,
            Instant appliedAt
    ) {}
}
