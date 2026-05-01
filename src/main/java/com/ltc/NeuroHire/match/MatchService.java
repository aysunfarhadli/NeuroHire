package com.ltc.NeuroHire.match;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ltc.NeuroHire.ai.AiAnalysisService;
import com.ltc.NeuroHire.ai.dto.CvAnalysisAi;
import com.ltc.NeuroHire.common.exception.ApiException;
import com.ltc.NeuroHire.cv.CVDocument;
import com.ltc.NeuroHire.cv.CvService;
import com.ltc.NeuroHire.match.dto.MatchDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MatchService {

    private final MatchResultRepository repo;
    private final AiAnalysisService aiAnalysisService;
    private final CvService cvService;
    private final ObjectMapper mapper;

    public MatchDto.Response match(MatchDto.MatchRequest req) {
        CVDocument cv = cvService.requireDocument(req.cvId());
        CvAnalysisAi ai = aiAnalysisService.analyzeCv(req.cvId(), req.jobId());

        MatchResult m = repo.findByCvIdAndJobId(req.cvId(), req.jobId()).orElse(MatchResult.builder().build());
        m.setCvId(req.cvId());
        m.setJobId(req.jobId());
        m.setCandidateUserId(cv.getCandidateUserId());
        m.setTotalScore(ai.matchScore());
        m.setSkillScore(ai.scoreBreakdown().skills());
        m.setExperienceScore(ai.scoreBreakdown().experience());
        m.setEducationScore(ai.scoreBreakdown().education());
        m.setDomainScore(ai.scoreBreakdown().domain());
        m.setAtsScore(ai.scoreBreakdown().atsFormat());
        m.setRecommendation(ai.recommendation());
        try {
            m.setExplanationJson(mapper.writeValueAsString(ai));
        } catch (Exception ignored) {}
        m = repo.save(m);
        return toResponse(m);
    }

    @Transactional(readOnly = true)
    public List<MatchDto.RankingRow> ranking(Long jobId) {
        return repo.findByJobIdOrderByTotalScoreDesc(jobId).stream()
                .map(m -> new MatchDto.RankingRow(
                        m.getId(), m.getCvId(), m.getCandidateUserId(),
                        m.getTotalScore(), m.getRecommendation()))
                .toList();
    }

    @Transactional(readOnly = true)
    public MatchDto.Response get(Long id) {
        MatchResult m = repo.findById(id).orElseThrow(() -> ApiException.notFound("Match not found"));
        return toResponse(m);
    }

    private MatchDto.Response toResponse(MatchResult m) {
        return new MatchDto.Response(
                m.getId(), m.getCvId(), m.getJobId(), m.getCandidateUserId(),
                m.getTotalScore(), m.getSkillScore(), m.getExperienceScore(),
                m.getEducationScore(), m.getDomainScore(), m.getAtsScore(),
                m.getRecommendation(), m.getExplanationJson(), m.getCreatedAt()
        );
    }
}
