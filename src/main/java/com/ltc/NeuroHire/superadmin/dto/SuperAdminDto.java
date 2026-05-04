package com.ltc.NeuroHire.superadmin.dto;

import com.ltc.NeuroHire.common.enums.Role;

import java.util.List;

public class SuperAdminDto {

    public record Metrics(
            long totalUsers,
            long totalCandidates,
            long totalRecruiters,
            long totalCompanies,
            long totalJobs,
            long openJobs
    ) {}

    public record UserRow(
            Long id, String fullName, String email, Role role,
            Long companyId, boolean enabled
    ) {}

    public record JobRow(
            Long id, String title, String status, String location,
            String employmentType, Long companyId, String companyName
    ) {}

    public record CompanyRow(
            Long id, String name, String industry, String subscriptionPlan,
            String website, long jobCount
    ) {}

    public record DashboardSnapshot(
            Metrics metrics,
            List<UserRow> recentUsers,
            List<CompanyRow> companies,
            List<JobRow> recentJobs
    ) {}

    public record UpdateUserStatusRequest(boolean enabled) {}
    public record UpdateUserRoleRequest(Role role) {}
    public record UpdateJobStatusRequest(String status) {}
}
