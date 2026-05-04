package com.ltc.NeuroHire.superadmin;

import com.ltc.NeuroHire.common.api.ApiResponse;
import com.ltc.NeuroHire.superadmin.dto.SuperAdminDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Super Admin", description = "Platform-wide administration (SUPER_ADMIN only)")
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/superadmin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class SuperAdminController {

    private final SuperAdminService service;

    @Operation(summary = "Dashboard snapshot: metrics + recent users/companies/jobs")
    @GetMapping("/dashboard")
    public ApiResponse<SuperAdminDto.DashboardSnapshot> dashboard() {
        return ApiResponse.ok(service.snapshot());
    }

    @Operation(summary = "List all users")
    @GetMapping("/users")
    public ApiResponse<List<SuperAdminDto.UserRow>> users() {
        return ApiResponse.ok(service.listUsers());
    }

    @Operation(summary = "Enable / disable a user")
    @PatchMapping("/users/{id}/status")
    public ApiResponse<SuperAdminDto.UserRow> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody SuperAdminDto.UpdateUserStatusRequest req) {
        return ApiResponse.ok(service.updateUserStatus(id, req.enabled()), "User status updated");
    }

    @Operation(summary = "Change a user's role")
    @PatchMapping("/users/{id}/role")
    public ApiResponse<SuperAdminDto.UserRow> updateRole(
            @PathVariable Long id,
            @Valid @RequestBody SuperAdminDto.UpdateUserRoleRequest req) {
        return ApiResponse.ok(service.updateUserRole(id, req.role()), "User role updated");
    }

    @Operation(summary = "Change a job's status (OPEN / CLOSED / FLAGGED)")
    @PatchMapping("/jobs/{id}/status")
    public ApiResponse<SuperAdminDto.JobRow> updateJobStatus(
            @PathVariable Long id,
            @Valid @RequestBody SuperAdminDto.UpdateJobStatusRequest req) {
        return ApiResponse.ok(service.updateJobStatus(id, req.status()), "Job status updated");
    }
}
