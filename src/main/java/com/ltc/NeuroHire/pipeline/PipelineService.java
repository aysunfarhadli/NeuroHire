package com.ltc.NeuroHire.pipeline;

import com.ltc.NeuroHire.common.enums.PipelineStageType;
import com.ltc.NeuroHire.common.exception.ApiException;
import com.ltc.NeuroHire.job.JobPost;
import com.ltc.NeuroHire.job.JobPostRepository;
import com.ltc.NeuroHire.notification.NotificationService;
import com.ltc.NeuroHire.pipeline.dto.PipelineDto;
import com.ltc.NeuroHire.security.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PipelineService {

    private final PipelineEntryRepository repo;
    private final JobPostRepository jobRepo;
    private final NotificationService notifications;

    public PipelineDto.Response upsertStage(PipelineDto.StageUpdateRequest req) {
        PipelineEntry e = repo.findByJobIdAndCandidateUserId(req.jobId(), req.candidateUserId())
                .orElse(PipelineEntry.builder()
                        .jobId(req.jobId())
                        .candidateUserId(req.candidateUserId())
                        .build());
        PipelineStageType prevStage = e.getStage();
        e.setStage(req.stage());
        e.setHrComment(req.hrComment());
        e.setUpdatedByUserId(CurrentUser.get().userId());
        e = repo.save(e);

        // Notify the candidate when the stage actually changes (skip first-time NEW assignment).
        if (prevStage != null && prevStage != req.stage()) {
            String jobTitle = jobRepo.findById(req.jobId()).map(JobPost::getTitle).orElse("a role");
            notifications.push(
                    req.candidateUserId(),
                    "APPLICATION_STAGE_CHANGED",
                    "Status update on " + jobTitle,
                    "Your application moved from " + prevStage.name() + " to " + req.stage().name() + ".",
                    "/app/applications"
            );
        }
        return toResponse(e);
    }

    @Transactional(readOnly = true)
    public List<PipelineDto.Response> listForJob(Long jobId) {
        return repo.findByJobIdOrderByUpdatedAtDesc(jobId).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public PipelineDto.Response get(Long id) {
        return repo.findById(id).map(this::toResponse)
                .orElseThrow(() -> ApiException.notFound("Pipeline entry not found"));
    }

    private PipelineDto.Response toResponse(PipelineEntry e) {
        return new PipelineDto.Response(
                e.getId(), e.getJobId(), e.getCandidateUserId(),
                e.getStage(), e.getHrComment(),
                e.getUpdatedByUserId(), e.getUpdatedAt()
        );
    }
}
