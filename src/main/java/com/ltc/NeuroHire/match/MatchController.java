package com.ltc.NeuroHire.match;

import com.ltc.NeuroHire.common.api.ApiResponse;
import com.ltc.NeuroHire.match.dto.MatchDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Match", description = "CV ↔ Job matching and ranking")
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/match")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService service;

    @Operation(summary = "Compute or refresh CV-job match (idempotent per CV+job)")
    @PostMapping
    public ApiResponse<MatchDto.Response> match(@Valid @RequestBody MatchDto.MatchRequest req) {
        return ApiResponse.ok(service.match(req), "Match computed");
    }

    @Operation(summary = "Ranked candidates for a given job (sorted by total score desc)")
    @GetMapping("/jobs/{jobId}/ranking")
    public ApiResponse<List<MatchDto.RankingRow>> ranking(@PathVariable Long jobId) {
        return ApiResponse.ok(service.ranking(jobId));
    }

    @Operation(summary = "Get a single match result by id")
    @GetMapping("/{id}")
    public ApiResponse<MatchDto.Response> get(@PathVariable Long id) {
        return ApiResponse.ok(service.get(id));
    }
}
