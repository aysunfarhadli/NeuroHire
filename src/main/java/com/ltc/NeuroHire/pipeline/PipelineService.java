package com.ltc.NeuroHire.pipeline;

import com.ltc.NeuroHire.common.exception.ApiException;
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

    public PipelineDto.Response upsertStage(PipelineDto.StageUpdateRequest req) {
        PipelineEntry e = repo.findByJobIdAndCandidateUserId(req.jobId(), req.candidateUserId())
                .orElse(PipelineEntry.builder()
                        .jobId(req.jobId())
                        .candidateUserId(req.candidateUserId())
                        .build());
        e.setStage(req.stage());
        e.setHrComment(req.hrComment());
        e.setUpdatedByUserId(CurrentUser.get().userId());
        e = repo.save(e);
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
