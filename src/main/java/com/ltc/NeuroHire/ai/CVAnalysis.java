package com.ltc.NeuroHire.ai;

import com.ltc.NeuroHire.common.audit.BaseEntity;
import com.ltc.NeuroHire.common.enums.CandidateLevel;
import com.ltc.NeuroHire.common.enums.Recommendation;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cv_analyses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CVAnalysis extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long cvId;

    private Long jobId;


    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private CandidateLevel candidateLevel;

    private double aiConfidence;

    @Lob
    @Column(name = "professional_summary", columnDefinition = "CLOB")
    private String professionalSummary;

    @Lob
    @Column(name = "strengths_json", columnDefinition = "CLOB")
    private String strengthsJson;

    @Lob
    @Column(name = "weaknesses_json", columnDefinition = "CLOB")
    private String weaknessesJson;

    @Lob
    @Column(name = "technical_skills_json", columnDefinition = "CLOB")
    private String technicalSkillsJson;

    @Lob
    @Column(name = "soft_skills_json", columnDefinition = "CLOB")
    private String softSkillsJson;

    @Lob
    @Column(name = "missing_keywords_json", columnDefinition = "CLOB")
    private String missingKeywordsJson;

    private int matchScore;
    private int skillScore;
    private int experienceScore;
    private int educationScore;
    private int domainScore;
    private int atsScore;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private Recommendation recommendation;

    @Lob
    @Column(name = "hr_explanation", columnDefinition = "CLOB")
    private String hrExplanation;

    @Lob
    @Column(name = "candidate_feedback", columnDefinition = "CLOB")
    private String candidateFeedback;



    @Lob
    @Column(name = "interview_questions_json", columnDefinition = "CLOB")
    private String interviewQuestionsJson;

    @Lob
    @Column(name = "cv_rewrites_json", columnDefinition = "CLOB")
    private String cvRewritesJson;

    @Lob
    @Column(name = "risk_flags_json", columnDefinition = "CLOB")
    private String riskFlagsJson;


}
