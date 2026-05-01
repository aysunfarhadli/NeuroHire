package com.ltc.NeuroHire.auth;

import com.ltc.NeuroHire.common.audit.BaseEntity;
import com.ltc.NeuroHire.common.enums.Role;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users", indexes = @Index(name = "idx_users_email", columnList = "email", unique = true))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String fullName;

    @Column(nullable = false, length = 200, unique = true)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Role role;

    @Column
    private Long companyId;

    @Column(length = 30)
    private String phone;

    @Column(length = 200)
    private String location;

    @Column(nullable = false)
    private boolean enabled;
}
