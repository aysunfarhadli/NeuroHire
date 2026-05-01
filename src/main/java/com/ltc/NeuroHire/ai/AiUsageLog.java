package com.ltc.NeuroHire.ai;

import com.ltc.NeuroHire.common.audit.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ai_usage_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiUsageLog extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private Long userId;

    @Column
    private Long companyId;

    @Column(length = 100)
    private String model;

    @Column(length = 50)
    private String operation;

    private int tokensUsed;

    private double costEstimateUsd;
}
