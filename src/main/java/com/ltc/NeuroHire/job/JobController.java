package com.ltc.NeuroHire.job;

import com.ltc.NeuroHire.common.api.ApiResponse;
import com.ltc.NeuroHire.job.dto.JobDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Jobs", description = "Job posts CRUD + AI-driven job description analysis")
@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService service;

    @Operation(summary = "Create a new job (HR / Recruiter)")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasAnyRole('HR','ADMIN','RECRUITER_AGENCY','HIRING_MANAGER')")
    @PostMapping
    public ApiResponse<JobDto.Response> create(@Valid @RequestBody JobDto.CreateRequest req) {
        return ApiResponse.ok(service.create(req), "Job created");
    }

    @Operation(summary = "List all jobs (authenticated)")
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping
    public ApiResponse<List<JobDto.Response>> list() {
        return ApiResponse.ok(service.list());
    }

    @Operation(summary = "List company jobs")
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/company/{companyId}")
    public ApiResponse<List<JobDto.Response>> listByCompany(@PathVariable Long companyId) {
        return ApiResponse.ok(service.listByCompany(companyId));
    }

    @Operation(summary = "Public list of OPEN jobs (no auth)")
    @GetMapping("/public/open")
    public ApiResponse<List<JobDto.Response>> publicOpen() {
        return ApiResponse.ok(service.listPublic());
    }

    @Operation(summary = "Job detail")
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/{id}")
    public ApiResponse<JobDto.Response> get(@PathVariable Long id) {
        return ApiResponse.ok(service.get(id));
    }

    @Operation(summary = "Update job")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasAnyRole('HR','ADMIN','RECRUITER_AGENCY','HIRING_MANAGER')")
    @PutMapping("/{id}")
    public ApiResponse<JobDto.Response> update(@PathVariable Long id,
                                               @Valid @RequestBody JobDto.UpdateRequest req) {
        return ApiResponse.ok(service.update(id, req), "Job updated");
    }

    @Operation(summary = "Delete job")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasAnyRole('HR','ADMIN','RECRUITER_AGENCY')")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ApiResponse.ok(null, "Job deleted");
    }

    @Operation(summary = "Trigger AI analysis on the job description (must-have / nice-to-have / responsibilities)")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasAnyRole('HR','ADMIN','RECRUITER_AGENCY','HIRING_MANAGER')")
    @PostMapping("/{id}/analyze")
    public ApiResponse<JobDto.AnalysisResponse> analyze(@PathVariable Long id) {
        return ApiResponse.ok(service.analyze(id), "Job analyzed");
    }

    @Operation(summary = "Get latest AI job analysis")
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/{id}/analysis")
    public ApiResponse<JobDto.AnalysisResponse> analysis(@PathVariable Long id) {
        return ApiResponse.ok(service.latestAnalysis(id));
    }
}
