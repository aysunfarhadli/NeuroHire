package com.ltc.NeuroHire.company;

import com.ltc.NeuroHire.common.audit.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "companies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Company extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(length = 100)
    private String industry;

    @Column(length = 50)
    private String subscriptionPlan;

    @Column(length = 500)
    private String website;

    @Column(length = 1000)
    private String description;
}
