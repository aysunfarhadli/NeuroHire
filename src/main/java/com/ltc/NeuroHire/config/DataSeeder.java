package com.ltc.NeuroHire.config;

import com.ltc.NeuroHire.auth.User;
import com.ltc.NeuroHire.auth.UserRepository;
import com.ltc.NeuroHire.common.enums.CandidateLevel;
import com.ltc.NeuroHire.common.enums.Role;
import com.ltc.NeuroHire.company.Company;
import com.ltc.NeuroHire.company.CompanyRepository;
import com.ltc.NeuroHire.job.JobPost;
import com.ltc.NeuroHire.job.JobPostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepo;
    private final CompanyRepository companyRepo;
    private final JobPostRepository jobRepo;
    private final PasswordEncoder encoder;

    @Override
    public void run(String... args) {
        if (userRepo.count() > 0) {
            log.info("Seed skipped — users already present");
            return;
        }
        Company c = companyRepo.save(Company.builder()
                .name("HireMind Demo Co")
                .industry("HR Tech")
                .subscriptionPlan("PRO")
                .website("https://hiremind.ai")
                .description("Seed demo company for local development")
                .build());

        User admin = userRepo.save(User.builder()
                .fullName("Platform Admin").email("admin@hiremind.ai")
                .passwordHash(encoder.encode("Admin123!"))
                .role(Role.ADMIN).enabled(true).companyId(c.getId()).build());

        User hr = userRepo.save(User.builder()
                .fullName("Aysel HR").email("hr@hiremind.ai")
                .passwordHash(encoder.encode("Hr123456!"))
                .role(Role.HR).enabled(true).companyId(c.getId()).build());

        User candidate = userRepo.save(User.builder()
                .fullName("Demo Candidate").email("candidate@hiremind.ai")
                .passwordHash(encoder.encode("Cand123!"))
                .role(Role.CANDIDATE).enabled(true).build());

        jobRepo.save(JobPost.builder()
                .companyId(c.getId()).createdByUserId(hr.getId())
                .title("Backend Engineer (Spring Boot, Microservices)")
                .description("""
                        We are hiring a Backend Engineer to join our HR Tech platform team.
                        Responsibilities:
                        - Design and build REST microservices in Spring Boot
                        - Implement service-to-service communication via Feign and Eureka
                        - Containerize services with Docker
                        - Cache hot reads with Redis
                        Requirements: 3+ years of Java, strong Spring Boot, microservices, Docker, Redis, REST.
                        Nice to have: Kubernetes, AWS, Kafka.
                        """)
                .seniority(CandidateLevel.MID)
                .location("Baku, AZ")
                .employmentType("FULL_TIME")
                .status("OPEN")
                .build());

        log.info("Seed complete: admin={}, hr={}, candidate={}", admin.getEmail(), hr.getEmail(), candidate.getEmail());
    }
}
