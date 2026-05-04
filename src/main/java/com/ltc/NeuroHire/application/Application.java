package com.ltc.NeuroHire.application;

import com.ltc.NeuroHire.common.audit.BaseEntity;
import com.ltc.NeuroHire.common.enums.PipelineStageType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "applications",
        indexes = {
                @Index(name = "idx_app_candidate", columnList = "candidateUserId"),
                @Index(name = "idx_app_job", columnList = "jobId"),
                @Index(name = "uq_app_candidate_job", columnList = "candidateUserId, jobId", unique = true)
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Application extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long candidateUserId;

    @Column(nullable = false)
    private Long jobId;

    /** Optional — the CV the candidate attached at apply time. */
    @Column
    private Long cvId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PipelineStageType stage;

    @Column(length = 4000)
    private String coverLetter;

    /** Free-form: "WEB", "LINKEDIN", "REFERRAL", etc. */
    @Column(length = 30)
    private String source;
}
