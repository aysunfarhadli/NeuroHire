package com.ltc.NeuroHire.audit;

import com.ltc.NeuroHire.common.audit.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private Long actorId;

    @Column(length = 100)
    private String action;

    @Column(length = 100)
    private String entityType;

    @Column
    private Long entityId;

    @Lob
    @Column(name = "metadata_json", columnDefinition = "CLOB")
    private String metadataJson;

    @Column(length = 64)
    private String correlationId;
}
