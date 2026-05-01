package com.ltc.NeuroHire.job;

import com.ltc.NeuroHire.common.audit.BaseEntity;
import com.ltc.NeuroHire.common.enums.CandidateLevel;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "job_analyses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobAnalysis extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long jobId;

    @Lob
    @Column(name = "must_have_skills_json", columnDefinition = "CLOB")
    private String mustHaveSkillsJson;

    @Lob
    @Column(name = "nice_to_have_skills_json", columnDefinition = "CLOB")
    private String niceToHaveSkillsJson;

    @Lob
    @Column(name = "responsibilities_json", columnDefinition = "CLOB")
    private String responsibilitiesJson;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private CandidateLevel seniority;

    @Column(length = 100)
    private String domain;

    private Integer minYearsExperience;
}
