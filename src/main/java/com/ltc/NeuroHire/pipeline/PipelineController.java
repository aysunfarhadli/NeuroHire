package com.ltc.NeuroHire.pipeline;

import com.ltc.NeuroHire.common.api.ApiResponse;
import com.ltc.NeuroHire.pipeline.dto.PipelineDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Pipeline", description = "HR hiring pipeline (NEW → REVIEWED → SHORTLISTED → INTERVIEW → OFFER → HIRED/REJECTED)")
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/pipeline")
@RequiredArgsConstructor
public class PipelineController {

    private final PipelineService service;

    @Operation(summary = "Set / update a candidate's stage on a job")
    @PreAuthorize("hasAnyRole('HR','ADMIN','RECRUITER_AGENCY','HIRING_MANAGER')")
    @PostMapping("/stage")
    public ApiResponse<PipelineDto.Response> upsert(@Valid @RequestBody PipelineDto.StageUpdateRequest req) {
        return ApiResponse.ok(service.upsertStage(req), "Stage updated");
    }

    @Operation(summary = "List pipeline entries for a job (Kanban view)")
    @GetMapping("/jobs/{jobId}")
    public ApiResponse<List<PipelineDto.Response>> listForJob(@PathVariable Long jobId) {
        return ApiResponse.ok(service.listForJob(jobId));
    }

    @Operation(summary = "Get pipeline entry by id")
    @GetMapping("/{id}")
    public ApiResponse<PipelineDto.Response> get(@PathVariable Long id) {
        return ApiResponse.ok(service.get(id));
    }
}
