package com.ltc.NeuroHire.cv;

import com.ltc.NeuroHire.common.audit.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "candidate_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateProfile extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long userId;

    @Column(length = 200)
    private String fullName;

    @Column(length = 200)
    private String email;

    @Column(length = 30)
    private String phone;

    @Column(length = 200)
    private String location;

    @Column(length = 2000)
    private String summary;

    @Lob
    @Column(name = "structured_json", columnDefinition = "CLOB")
    private String structuredJson;
}
