package com.ltc.NeuroHire.pipeline;

import com.ltc.NeuroHire.common.audit.BaseEntity;
import com.ltc.NeuroHire.common.enums.PipelineStageType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pipeline_entries",
        indexes = @Index(name = "idx_pipeline_job_candidate", columnList = "jobId, candidateUserId", unique = true))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PipelineEntry extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long jobId;

    @Column(nullable = false)
    private Long candidateUserId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PipelineStageType stage;

    @Column(length = 2000)
    private String hrComment;

    @Column
    private Long updatedByUserId;
}
