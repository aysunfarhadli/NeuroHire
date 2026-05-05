package com.ltc.NeuroHire.notification;

import com.ltc.NeuroHire.common.audit.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "notifications",
        indexes = {
                @Index(name = "idx_notif_user", columnList = "userId"),
                @Index(name = "idx_notif_user_read", columnList = "userId, isRead")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false, length = 40)
    private String type;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 600)
    private String body;

    /** Optional in-app deep link, e.g. /app/applications or /app/jobs/12 */
    @Column(length = 200)
    private String link;

    @Column(name = "is_read", nullable = false)
    private boolean read;
}
