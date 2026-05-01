package com.ltc.NeuroHire.ai;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ltc.NeuroHire.ai.dto.CvAnalysisAi;
import com.ltc.NeuroHire.common.exception.ApiException;
import com.ltc.NeuroHire.cv.CVDocument;
import com.ltc.NeuroHire.cv.CvService;
import com.ltc.NeuroHire.job.JobPost;
import com.ltc.NeuroHire.job.JobService;
import com.ltc.NeuroHire.security.AuthPrincipal;
import com.ltc.NeuroHire.security.CurrentUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AiAnalysisService {

    private final AiService aiService;
    private final CvService cvService;
    private final JobService jobService;
    private final CVAnalysisRepository repo;
    private final AiUsageLogRepository usageRepo;
    private final ObjectMapper mapper;

    public CvAnalysisAi analyzeCv(Long cvId, Long jobId) {
        CVDocument cv = cvService.requireDocument(cvId);
        if (cv.getExtractedText() == null || cv.getExtractedText().isBlank()) {
            throw ApiException.badRequest("CV_NOT_PARSED", "CV text not extracted yet — try again shortly");
        }
        String jd = null;
        if (jobId != null) {
            JobPost job = jobService.require(jobId);
            jd = job.getDescription();
        }
        CvAnalysisAi ai = aiService.analyzeCv(cv.getExtractedText(), jd);

        try {
            CVAnalysis a = CVAnalysis.builder()
                    .cvId(cvId)
                    .jobId(jobId)
                    .candidateLevel(ai.candidateLevel())
                    .aiConfidence(ai.aiConfidence())
                    .professionalSummary(ai.professionalSummary())
                    .strengthsJson(mapper.writeValueAsString(ai.strengths()))
                    .weaknessesJson(mapper.writeValueAsString(ai.weaknesses()))
                    .technicalSkillsJson(mapper.writeValueAsString(ai.technicalSkills()))
                    .softSkillsJson(mapper.writeValueAsString(ai.softSkills()))
                    .missingKeywordsJson(mapper.writeValueAsString(ai.missingKeywords()))
                    .matchScore(ai.matchScore())
                    .skillScore(ai.scoreBreakdown().skills())
                    .experienceScore(ai.scoreBreakdown().experience())
                    .educationScore(ai.scoreBreakdown().education())
                    .domainScore(ai.scoreBreakdown().domain())
                    .atsScore(ai.scoreBreakdown().atsFormat())
                    .recommendation(ai.recommendation())
                    .hrExplanation(ai.hrExplanation())
                    .candidateFeedback(ai.candidateFeedback())
                    .interviewQuestionsJson(mapper.writeValueAsString(ai.interviewQuestions()))
                    .cvRewritesJson(mapper.writeValueAsString(ai.cvRewrites()))
                    .riskFlagsJson(mapper.writeValueAsString(ai.riskFlags()))
                    .build();
            repo.save(a);
        } catch (Exception ex) {
            log.error("Failed to persist CV analysis", ex);
        }

        AuthPrincipal p = CurrentUser.getOrNull();
        usageRepo.save(AiUsageLog.builder()
                .userId(p == null ? null : p.userId())
                .companyId(p == null ? null : p.companyId())
                .model(aiService.getModel())
                .operation(jobId == null ? "CV_ANALYZE" : "CV_JOB_MATCH")
                .tokensUsed(estimateTokens(cv.getExtractedText(), jd))
                .costEstimateUsd(0.0)
                .build());

        return ai;
    }

    @Transactional(readOnly = true)
    public CvAnalysisAi latestForCv(Long cvId) {
        CVAnalysis a = repo.findFirstByCvIdOrderByCreatedAtDesc(cvId)
                .orElseThrow(() -> ApiException.notFound("No AI analysis for this CV yet"));
        return toAiDto(a);
    }

    public CvAnalysisAi toAiDto(CVAnalysis a) {
        return new CvAnalysisAi(
                a.getCandidateLevel(), a.getAiConfidence(), a.getProfessionalSummary(),
                readList(a.getStrengthsJson()), readList(a.getWeaknessesJson()),
                readList(a.getTechnicalSkillsJson()), readList(a.getSoftSkillsJson()),
                readList(a.getMissingKeywordsJson()),
                a.getMatchScore(),
                new CvAnalysisAi.ScoreBreakdown(a.getSkillScore(), a.getExperienceScore(),
                        a.getEducationScore(), a.getDomainScore(), a.getAtsScore()),
                a.getRecommendation(), a.getHrExplanation(), a.getCandidateFeedback(),
                readQuestions(a.getInterviewQuestionsJson()),
                readRewrites(a.getCvRewritesJson()),
                readList(a.getRiskFlagsJson())
        );
    }

    private List<String> readList(String json) {
        if (json == null || json.isBlank()) return Collections.emptyList();
        try { return mapper.readValue(json, new TypeReference<List<String>>() {}); }
        catch (Exception ex) { return Collections.emptyList(); }
    }

    private List<CvAnalysisAi.InterviewQuestion> readQuestions(String json) {
        if (json == null || json.isBlank()) return Collections.emptyList();
        try { return mapper.readValue(json, new TypeReference<List<CvAnalysisAi.InterviewQuestion>>() {}); }
        catch (Exception ex) { return Collections.emptyList(); }
    }

    private List<CvAnalysisAi.CvRewrite> readRewrites(String json) {
        if (json == null || json.isBlank()) return Collections.emptyList();
        try { return mapper.readValue(json, new TypeReference<List<CvAnalysisAi.CvRewrite>>() {}); }
        catch (Exception ex) { return Collections.emptyList(); }
    }

    private int estimateTokens(String... parts) {
        int total = 0;
        for (String s : parts) if (s != null) total += s.length() / 4;
        return total;
    }
}
