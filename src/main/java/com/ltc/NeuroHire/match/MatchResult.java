package com.ltc.NeuroHire.match;

import com.ltc.NeuroHire.common.audit.BaseEntity;
import com.ltc.NeuroHire.common.enums.Recommendation;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "match_results",
        indexes = {
                @Index(name = "idx_match_job_score", columnList = "jobId, totalScore"),
                @Index(name = "idx_match_cv_job", columnList = "cvId, jobId", unique = true)
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchResult extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long cvId;

    @Column(nullable = false)
    private Long jobId;

    @Column(nullable = false)
    private Long candidateUserId;

    private int totalScore;
    private int skillScore;
    private int experienceScore;
    private int educationScore;
    private int domainScore;
    private int atsScore;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private Recommendation recommendation;

    @Lob
    @Column(name = "explanation_json", columnDefinition = "CLOB")
    private String explanationJson;
}
