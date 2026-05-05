package com.ltc.NeuroHire.application;

import com.ltc.NeuroHire.application.dto.ApplicationDto;
import com.ltc.NeuroHire.common.enums.PipelineStageType;
import com.ltc.NeuroHire.common.enums.Role;
import com.ltc.NeuroHire.common.event.HireMindEvent;
import com.ltc.NeuroHire.common.exception.ApiException;
import com.ltc.NeuroHire.company.CompanyRepository;
import com.ltc.NeuroHire.cv.CVDocumentRepository;
import com.ltc.NeuroHire.job.JobPost;
import com.ltc.NeuroHire.job.JobPostRepository;
import com.ltc.NeuroHire.notification.NotificationService;
import com.ltc.NeuroHire.pipeline.PipelineEntry;
import com.ltc.NeuroHire.pipeline.PipelineEntryRepository;
import com.ltc.NeuroHire.security.AuthPrincipal;
import com.ltc.NeuroHire.security.CurrentUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ApplicationService {

    private final ApplicationRepository repo;
    private final JobPostRepository jobRepo;
    private final CompanyRepository companyRepo;
    private final CVDocumentRepository cvRepo;
    private final PipelineEntryRepository pipelineRepo;
    private final NotificationService notifications;
    private final ApplicationEventPublisher events;

    public ApplicationDto.Response apply(ApplicationDto.CreateRequest req) {
        AuthPrincipal me = CurrentUser.get();
        if (me.role() != Role.CANDIDATE) {
            throw ApiException.forbidden("Only candidates can apply to jobs");
        }
        JobPost job = jobRepo.findById(req.jobId())
                .orElseThrow(() -> ApiException.notFound("Job not found"));
        if (!"OPEN".equalsIgnoreCase(job.getStatus())) {
            throw ApiException.badRequest("JOB_NOT_OPEN", "This job is not accepting applications");
        }
        if (repo.existsByCandidateUserIdAndJobId(me.userId(), req.jobId())) {
            throw ApiException.conflict("ALREADY_APPLIED", "You have already applied to this job");
        }

        Long cvId = req.cvId();
        if (cvId == null) {
            // Use latest CV if any
            cvId = cvRepo.findByCandidateUserIdOrderByCreatedAtDesc(me.userId()).stream()
                    .findFirst().map(c -> c.getId()).orElse(null);
        } else {
            cvRepo.findById(cvId).filter(c -> c.getCandidateUserId().equals(me.userId()))
                    .orElseThrow(() -> ApiException.badRequest("CV_INVALID", "CV does not belong to you"));
        }

        Application app = Application.builder()
                .candidateUserId(me.userId())
                .jobId(job.getId())
                .cvId(cvId)
                .stage(PipelineStageType.NEW)
                .coverLetter(req.coverLetter())
                .source(req.source() == null ? "WEB" : req.source())
                .build();
        app = repo.save(app);

        // Mirror into pipeline so HR sees on kanban
        pipelineRepo.findByJobIdAndCandidateUserId(job.getId(), me.userId())
                .orElseGet(() -> pipelineRepo.save(PipelineEntry.builder()
                        .jobId(job.getId())
                        .candidateUserId(me.userId())
                        .stage(PipelineStageType.NEW)
                        .updatedByUserId(me.userId())
                        .build()));

        events.publishEvent(HireMindEvent.of("CANDIDATE_APPLIED", Map.of(
                "applicationId", app.getId(),
                "candidateUserId", me.userId(),
                "jobId", job.getId(),
                "cvId", cvId == null ? "" : cvId
        )));

        // Notify the recruiter who posted this job (the candidate sees their own action).
        if (job.getCreatedByUserId() != null) {
            notifications.push(
                    job.getCreatedByUserId(),
                    "APPLICATION_RECEIVED",
                    "New applicant on " + job.getTitle(),
                    "A candidate just applied. Open the pipeline to review.",
                    "/app/pipeline"
            );
        }

        log.info("Candidate {} applied to job {} (cvId={})", me.userId(), job.getId(), cvId);
        return toResponse(app);
    }

    @Transactional(readOnly = true)
    public List<ApplicationDto.CandidateView> myApplications() {
        AuthPrincipal me = CurrentUser.get();
        List<Application> apps = repo.findByCandidateUserIdOrderByCreatedAtDesc(me.userId());

        Map<Long, JobPost> jobs = new HashMap<>();
        apps.forEach(a -> jobs.computeIfAbsent(a.getJobId(),
                id -> jobRepo.findById(id).orElse(null)));

        Map<Long, String> companyNames = new HashMap<>();
        jobs.values().stream().filter(j -> j != null).forEach(j ->
                companyNames.computeIfAbsent(j.getCompanyId(),
                        id -> companyRepo.findById(id).map(c -> c.getName()).orElse("—")));

        return apps.stream().map(a -> {
            JobPost j = jobs.get(a.getJobId());
            return new ApplicationDto.CandidateView(
                    a.getId(), a.getJobId(),
                    j == null ? "—" : j.getTitle(),
                    j == null ? "—" : companyNames.getOrDefault(j.getCompanyId(), "—"),
                    a.getStage(), a.getCreatedAt()
            );
        }).toList();
    }

    @Transactional(readOnly = true)
    public List<ApplicationDto.Response> listForJob(Long jobId) {
        return repo.findByJobIdOrderByCreatedAtDesc(jobId).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public boolean hasApplied(Long jobId) {
        AuthPrincipal me = CurrentUser.get();
        if (me.role() != Role.CANDIDATE) return false;
        return repo.existsByCandidateUserIdAndJobId(me.userId(), jobId);
    }

    public void withdraw(Long applicationId) {
        AuthPrincipal me = CurrentUser.get();
        Application app = repo.findById(applicationId)
                .orElseThrow(() -> ApiException.notFound("Application not found"));
        if (!app.getCandidateUserId().equals(me.userId())) {
            throw ApiException.forbidden("Cannot withdraw someone else's application");
        }
        repo.delete(app);
        pipelineRepo.findByJobIdAndCandidateUserId(app.getJobId(), me.userId())
                .ifPresent(pipelineRepo::delete);
    }

    private ApplicationDto.Response toResponse(Application a) {
        return new ApplicationDto.Response(
                a.getId(), a.getCandidateUserId(), a.getJobId(), a.getCvId(),
                a.getStage(), a.getCoverLetter(), a.getSource(), a.getCreatedAt()
        );
    }
}
