package com.ltc.NeuroHire.ai.dto;

import com.ltc.NeuroHire.common.enums.CandidateLevel;
import com.ltc.NeuroHire.common.enums.Recommendation;

import java.util.List;

public record CvAnalysisAi(
        CandidateLevel candidateLevel,
        double aiConfidence,
        String professionalSummary,
        List<String> strengths,
        List<String> weaknesses,
        List<String> technicalSkills,
        List<String> softSkills,
        List<String> missingKeywords,
        int matchScore,
        ScoreBreakdown scoreBreakdown,
        Recommendation recommendation,
        String hrExplanation,
        String candidateFeedback,
        List<InterviewQuestion> interviewQuestions,
        List<CvRewrite> cvRewrites,
        List<String> riskFlags
) {
    public record ScoreBreakdown(int skills, int experience, int education, int domain, int atsFormat) {}
    public record InterviewQuestion(String question, String reason) {}
    public record CvRewrite(String before, String after, String reason) {}
}
