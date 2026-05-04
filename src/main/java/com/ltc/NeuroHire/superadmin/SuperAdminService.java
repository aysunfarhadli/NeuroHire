package com.ltc.NeuroHire.superadmin;

import com.ltc.NeuroHire.auth.User;
import com.ltc.NeuroHire.auth.UserRepository;
import com.ltc.NeuroHire.common.enums.Role;
import com.ltc.NeuroHire.common.exception.ApiException;
import com.ltc.NeuroHire.company.Company;
import com.ltc.NeuroHire.company.CompanyRepository;
import com.ltc.NeuroHire.job.JobPost;
import com.ltc.NeuroHire.job.JobPostRepository;
import com.ltc.NeuroHire.superadmin.dto.SuperAdminDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
public class SuperAdminService {

    private final UserRepository userRepo;
    private final CompanyRepository companyRepo;
    private final JobPostRepository jobRepo;

    private static final Set<Role> RECRUITER_ROLES = Set.of(
            Role.HR, Role.HIRING_MANAGER, Role.RECRUITER_AGENCY
    );

    @Transactional(readOnly = true)
    public SuperAdminDto.DashboardSnapshot snapshot() {
        List<User> users = userRepo.findAll();
        List<Company> companies = companyRepo.findAll();
        List<JobPost> jobs = jobRepo.findAll();

        long candidates = users.stream().filter(u -> u.getRole() == Role.CANDIDATE).count();
        long recruiters = users.stream().filter(u -> RECRUITER_ROLES.contains(u.getRole())).count();
        long openJobs = jobs.stream().filter(j -> "OPEN".equalsIgnoreCase(j.getStatus())).count();

        var metrics = new SuperAdminDto.Metrics(
                users.size(), candidates, recruiters,
                companies.size(), jobs.size(), openJobs
        );

        Map<Long, String> companyNames = new HashMap<>();
        for (Company c : companies) companyNames.put(c.getId(), c.getName());

        Map<Long, Long> jobsByCompany = new HashMap<>();
        for (JobPost j : jobs) jobsByCompany.merge(j.getCompanyId(), 1L, Long::sum);

        return new SuperAdminDto.DashboardSnapshot(
                metrics,
                users.stream().limit(20).map(this::toUserRow).toList(),
                companies.stream().map(c -> new SuperAdminDto.CompanyRow(
                        c.getId(), c.getName(), c.getIndustry(), c.getSubscriptionPlan(),
                        c.getWebsite(), jobsByCompany.getOrDefault(c.getId(), 0L)
                )).toList(),
                jobs.stream().limit(20).map(j -> new SuperAdminDto.JobRow(
                        j.getId(), j.getTitle(), j.getStatus(), j.getLocation(),
                        j.getEmploymentType(), j.getCompanyId(),
                        companyNames.getOrDefault(j.getCompanyId(), "—")
                )).toList()
        );
    }

    @Transactional(readOnly = true)
    public List<SuperAdminDto.UserRow> listUsers() {
        return userRepo.findAll().stream().map(this::toUserRow).toList();
    }

    public SuperAdminDto.UserRow updateUserStatus(Long userId, boolean enabled) {
        User u = userRepo.findById(userId).orElseThrow(() -> ApiException.notFound("User not found"));
        u.setEnabled(enabled);
        return toUserRow(u);
    }

    public SuperAdminDto.UserRow updateUserRole(Long userId, Role role) {
        User u = userRepo.findById(userId).orElseThrow(() -> ApiException.notFound("User not found"));
        u.setRole(role);
        return toUserRow(u);
    }

    public SuperAdminDto.JobRow updateJobStatus(Long jobId, String status) {
        JobPost j = jobRepo.findById(jobId).orElseThrow(() -> ApiException.notFound("Job not found"));
        j.setStatus(status);
        String companyName = companyRepo.findById(j.getCompanyId()).map(Company::getName).orElse("—");
        return new SuperAdminDto.JobRow(j.getId(), j.getTitle(), j.getStatus(), j.getLocation(),
                j.getEmploymentType(), j.getCompanyId(), companyName);
    }

    private SuperAdminDto.UserRow toUserRow(User u) {
        return new SuperAdminDto.UserRow(
                u.getId(), u.getFullName(), u.getEmail(), u.getRole(),
                u.getCompanyId(), u.isEnabled()
        );
    }
}
