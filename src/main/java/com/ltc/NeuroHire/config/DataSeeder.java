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

        Company hireMind = save("HireMind AI", "HR Tech", "PRO",
                "https://hiremind.ai",
                "AI-powered HR decision support platform helping companies hire smarter.");
        Company nimbus = save("Nimbus Cloud", "Cloud Infrastructure", "PRO",
                "https://nimbus.dev",
                "Distributed cloud platform serving 200+ enterprise customers globally.");
        Company verdant = save("Verdant Health", "Healthtech", "PRO",
                "https://verdant.health",
                "Telemedicine and AI-assisted diagnostics for primary care clinics.");
        Company atlasFin = save("Atlas Financial", "Fintech", "ENTERPRISE",
                "https://atlasfin.com",
                "Embedded payment infrastructure for marketplaces and SaaS.");
        Company orbitMedia = save("Orbit Media", "Media & Entertainment", "GROWTH",
                "https://orbitmedia.tv",
                "Streaming platform for independent creators and live events.");
        Company kinetixRobotics = save("Kinetix Robotics", "Robotics", "PRO",
                "https://kinetix.ai",
                "Autonomous warehouse robots and computer-vision pick systems.");

        User superAdmin = userRepo.save(User.builder()
                .fullName("Platform Owner").email("super@hiremind.ai")
                .passwordHash(encoder.encode("Super123!"))
                .role(Role.SUPER_ADMIN).enabled(true).build());

        User admin = userRepo.save(User.builder()
                .fullName("Platform Admin").email("admin@hiremind.ai")
                .passwordHash(encoder.encode("Admin123!"))
                .role(Role.ADMIN).enabled(true).companyId(hireMind.getId()).build());

        User aysel = userRepo.save(User.builder()
                .fullName("Aysel Mammadova").email("hr@hiremind.ai")
                .passwordHash(encoder.encode("Hr123456!"))
                .role(Role.HR).enabled(true).companyId(hireMind.getId()).build());

        User nimbusHr = userRepo.save(User.builder()
                .fullName("Lara Petrov").email("hr@nimbus.dev")
                .passwordHash(encoder.encode("Hr123456!"))
                .role(Role.HR).enabled(true).companyId(nimbus.getId()).build());

        User verdantHr = userRepo.save(User.builder()
                .fullName("Ravi Subramaniam").email("hr@verdant.health")
                .passwordHash(encoder.encode("Hr123456!"))
                .role(Role.HIRING_MANAGER).enabled(true).companyId(verdant.getId()).build());

        User atlasHr = userRepo.save(User.builder()
                .fullName("Marco Bianchi").email("hr@atlasfin.com")
                .passwordHash(encoder.encode("Hr123456!"))
                .role(Role.HR).enabled(true).companyId(atlasFin.getId()).build());

        User orbitHr = userRepo.save(User.builder()
                .fullName("Naomi Chen").email("hr@orbitmedia.tv")
                .passwordHash(encoder.encode("Hr123456!"))
                .role(Role.HR).enabled(true).companyId(orbitMedia.getId()).build());

        User kinetixHr = userRepo.save(User.builder()
                .fullName("Erik Sorensen").email("hr@kinetix.ai")
                .passwordHash(encoder.encode("Hr123456!"))
                .role(Role.HIRING_MANAGER).enabled(true).companyId(kinetixRobotics.getId()).build());

        User candidate = userRepo.save(User.builder()
                .fullName("Demo Candidate").email("candidate@hiremind.ai")
                .passwordHash(encoder.encode("Cand123!"))
                .role(Role.CANDIDATE).enabled(true).build());

        seedJob(hireMind.getId(), aysel.getId(),
                "Backend Engineer (Spring Boot, Microservices)",
                """
                        We are hiring a Backend Engineer to join our HR Tech platform team.
                        Responsibilities:
                        - Design and build REST microservices in Spring Boot
                        - Implement service-to-service communication via Feign and Eureka
                        - Containerize services with Docker
                        - Cache hot reads with Redis
                        Requirements: 3+ years of Java, strong Spring Boot, microservices, Docker, Redis, REST.
                        Nice to have: Kubernetes, AWS, Kafka.""",
                CandidateLevel.MID, "Baku, AZ", "FULL_TIME");

        seedJob(hireMind.getId(), aysel.getId(),
                "Senior Frontend Engineer (React, TypeScript)",
                """
                        Lead the front-end of our AI hiring product. You will own the design system,
                        ship pixel-perfect UI, and partner with product on the next-gen recruiter UX.
                        Requirements: 5+ years React, deep TypeScript, comfort with Vite + Tailwind.
                        Nice to have: design background, accessibility expertise.""",
                CandidateLevel.SENIOR, "Remote (EMEA)", "FULL_TIME");

        seedJob(nimbus.getId(), nimbusHr.getId(),
                "Site Reliability Engineer",
                """
                        Keep our multi-region platform 99.99% available. You will work on capacity
                        planning, incident response, observability and infrastructure-as-code.
                        Requirements: Kubernetes, Terraform, Prometheus, on-call experience.""",
                CandidateLevel.SENIOR, "Berlin, DE", "FULL_TIME");

        seedJob(nimbus.getId(), nimbusHr.getId(),
                "Cloud Solutions Architect",
                """
                        Partner with enterprise customers to design scalable cloud architectures
                        on top of Nimbus. Pre-sales + post-sales technical leadership.
                        Requirements: 7+ years architecture, AWS or GCP at scale, customer-facing.""",
                CandidateLevel.SENIOR, "Remote (Global)", "FULL_TIME");

        seedJob(verdant.getId(), verdantHr.getId(),
                "Machine Learning Engineer — Medical Imaging",
                """
                        Train and deploy diagnostic models for radiology and dermatology.
                        Requirements: PyTorch, MLOps, comfort handling DICOM and clinical data.
                        Nice to have: published research in medical imaging.""",
                CandidateLevel.MID, "Boston, MA", "FULL_TIME");

        seedJob(verdant.getId(), verdantHr.getId(),
                "Junior Backend Developer (Node.js)",
                """
                        Help build the patient-facing telemedicine API. Mentorship-heavy role —
                        a great place to grow your first 2 years of professional engineering.
                        Requirements: Node.js, REST, SQL fundamentals, eagerness to learn.""",
                CandidateLevel.JUNIOR, "Remote (US)", "FULL_TIME");

        seedJob(atlasFin.getId(), atlasHr.getId(),
                "Senior Payments Engineer",
                """
                        Own the core ledger and money-movement primitives at Atlas. Strong
                        guarantees, idempotency, double-entry accounting, regulatory rigor.
                        Requirements: Java/Go, distributed systems, prior fintech experience required.""",
                CandidateLevel.SENIOR, "London, UK", "FULL_TIME");

        seedJob(atlasFin.getId(), atlasHr.getId(),
                "Compliance Analyst",
                """
                        Monitor transactions, file SARs, and partner with engineering on rules
                        for our risk engine. Direct exposure to executive team.
                        Requirements: 2+ years AML/KYC, attention to detail, comms skills.""",
                CandidateLevel.MID, "London, UK", "FULL_TIME");

        seedJob(orbitMedia.getId(), orbitHr.getId(),
                "Video Streaming Engineer",
                """
                        Tune our HLS/DASH delivery pipeline for live events at million-viewer scale.
                        Requirements: FFmpeg, CDN, low-latency streaming, packet-level networking.""",
                CandidateLevel.MID, "Los Angeles, CA", "FULL_TIME");

        seedJob(orbitMedia.getId(), orbitHr.getId(),
                "Product Designer (Mobile)",
                """
                        Design the mobile creator experience end-to-end. You'll partner with
                        engineering on a small, autonomous squad.
                        Requirements: Figma, mobile design system experience, motion fluency.""",
                CandidateLevel.MID, "Remote (US)", "CONTRACT");

        seedJob(kinetixRobotics.getId(), kinetixHr.getId(),
                "Computer Vision Engineer",
                """
                        Build perception pipelines for warehouse pick robots. Real-time inference
                        on edge devices, sensor fusion, calibration.
                        Requirements: C++, OpenCV, ROS, deep learning frameworks.""",
                CandidateLevel.SENIOR, "Munich, DE", "FULL_TIME");

        seedJob(kinetixRobotics.getId(), kinetixHr.getId(),
                "Robotics Software Intern",
                """
                        Summer internship working alongside our motion-planning team. Suitable for
                        late-stage CS / Robotics undergraduates.
                        Requirements: Python, basic robotics coursework, curiosity.""",
                CandidateLevel.JUNIOR, "Munich, DE", "INTERNSHIP");

        log.info("Seed complete: super={}, admin={}, hr={}, candidate={}, companies={}, jobs={}",
                superAdmin.getEmail(), admin.getEmail(), aysel.getEmail(), candidate.getEmail(),
                companyRepo.count(), jobRepo.count());
    }

    private Company save(String name, String industry, String plan, String website, String description) {
        return companyRepo.save(Company.builder()
                .name(name).industry(industry).subscriptionPlan(plan)
                .website(website).description(description).build());
    }

    private void seedJob(Long companyId, Long userId, String title, String description,
                         CandidateLevel level, String location, String type) {
        jobRepo.save(JobPost.builder()
                .companyId(companyId).createdByUserId(userId)
                .title(title).description(description)
                .seniority(level).location(location).employmentType(type)
                .status("OPEN").build());
    }
}
