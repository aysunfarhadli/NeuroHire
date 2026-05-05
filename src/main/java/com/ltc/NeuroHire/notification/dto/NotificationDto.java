package com.ltc.NeuroHire.notification.dto;

import java.time.Instant;

public class NotificationDto {

    public record Item(
            Long id,
            String type,
            String title,
            String body,
            String link,
            boolean read,
            Instant createdAt
    ) {}

    public record UnreadCount(long unread) {}
}
