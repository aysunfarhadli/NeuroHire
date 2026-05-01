package com.ltc.NeuroHire.job;

import com.ltc.NeuroHire.common.audit.BaseEntity;
import com.ltc.NeuroHire.common.enums.CandidateLevel;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "job_posts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobPost extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long companyId;

    @Column(nullable = false)
    private Long createdByUserId;

    @Column(nullable = false, length = 200)
    private String title;

    @Lob
    @Column(nullable = false, columnDefinition = "CLOB")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private CandidateLevel seniority;

    @Column(length = 200)
    private String location;

    @Column(length = 50)
    private String employmentType;

    @Column(length = 30)
    private String status;
}
