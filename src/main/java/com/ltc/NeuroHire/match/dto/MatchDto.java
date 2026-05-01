package com.ltc.NeuroHire.match.dto;

import com.ltc.NeuroHire.common.enums.Recommendation;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;

public class MatchDto {

    public record MatchRequest(
            @NotNull Long cvId,
            @NotNull Long jobId
    ) {}

    public record Response(
            Long id, Long cvId, Long jobId, Long candidateUserId,
            int totalScore, int skillScore, int experienceScore,
            int educationScore, int domainScore, int atsScore,
            Recommendation recommendation,
            String explanationJson,
            Instant createdAt
    ) {}

    public record RankingRow(
            Long matchId, Long cvId, Long candidateUserId,
            int totalScore, Recommendation recommendation
    ) {}
}
