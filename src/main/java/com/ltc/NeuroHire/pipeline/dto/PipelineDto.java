package com.ltc.NeuroHire.pipeline.dto;

import com.ltc.NeuroHire.common.enums.PipelineStageType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.Instant;

public class PipelineDto {

    public record StageUpdateRequest(
            @NotNull Long jobId,
            @NotNull Long candidateUserId,
            @NotNull PipelineStageType stage,
            @Size(max = 2000) String hrComment
    ) {}

    public record Response(
            Long id, Long jobId, Long candidateUserId,
            PipelineStageType stage, String hrComment,
            Long updatedByUserId, Instant updatedAt
    ) {}
}
