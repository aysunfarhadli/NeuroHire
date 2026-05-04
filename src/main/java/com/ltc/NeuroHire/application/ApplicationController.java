package com.ltc.NeuroHire.application;

import com.ltc.NeuroHire.application.dto.ApplicationDto;
import com.ltc.NeuroHire.common.api.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Tag(name = "Applications", description = "Candidate applications to jobs (one per candidate per job)")
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService service;

    @Operation(summary = "Apply to a job (CANDIDATE only)")
    @PreAuthorize("hasRole('CANDIDATE')")
    @PostMapping
    public ApiResponse<ApplicationDto.Response> apply(@Valid @RequestBody ApplicationDto.CreateRequest req) {
        return ApiResponse.ok(service.apply(req), "Application submitted");
    }

    @Operation(summary = "My applications (CANDIDATE only)")
    @PreAuthorize("hasRole('CANDIDATE')")
    @GetMapping("/me")
    public ApiResponse<List<ApplicationDto.CandidateView>> myApplications() {
        return ApiResponse.ok(service.myApplications());
    }

    @Operation(summary = "Have I already applied to this job? (CANDIDATE only)")
    @PreAuthorize("hasRole('CANDIDATE')")
    @GetMapping("/me/applied/{jobId}")
    public ApiResponse<Map<String, Boolean>> hasApplied(@PathVariable Long jobId) {
        return ApiResponse.ok(Map.of("applied", service.hasApplied(jobId)));
    }

    @Operation(summary = "List applications for a job (HR-side)")
    @PreAuthorize("hasAnyRole('HR','ADMIN','RECRUITER_AGENCY','HIRING_MANAGER','SUPER_ADMIN')")
    @GetMapping("/job/{jobId}")
    public ApiResponse<List<ApplicationDto.Response>> listForJob(@PathVariable Long jobId) {
        return ApiResponse.ok(service.listForJob(jobId));
    }

    @Operation(summary = "Withdraw my application (CANDIDATE only)")
    @PreAuthorize("hasRole('CANDIDATE')")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> withdraw(@PathVariable Long id) {
        service.withdraw(id);
        return ApiResponse.ok(null, "Application withdrawn");
    }
}
