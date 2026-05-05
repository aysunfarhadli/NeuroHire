package com.ltc.NeuroHire.notification;

import com.ltc.NeuroHire.common.api.ApiResponse;
import com.ltc.NeuroHire.notification.dto.NotificationDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Tag(name = "Notifications", description = "In-app notifications for the current user")
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService service;

    @Operation(summary = "List my recent notifications")
    @GetMapping
    public ApiResponse<List<NotificationDto.Item>> list(
            @RequestParam(defaultValue = "20") int limit) {
        return ApiResponse.ok(service.listForCurrentUser(limit));
    }

    @Operation(summary = "Unread count for the badge")
    @GetMapping("/unread-count")
    public ApiResponse<NotificationDto.UnreadCount> unread() {
        return ApiResponse.ok(new NotificationDto.UnreadCount(service.unreadForCurrentUser()));
    }

    @Operation(summary = "Mark a single notification read")
    @PatchMapping("/{id}/read")
    public ApiResponse<NotificationDto.Item> markRead(@PathVariable Long id) {
        return ApiResponse.ok(service.markRead(id));
    }

    @Operation(summary = "Mark all notifications read")
    @PatchMapping("/read-all")
    public ApiResponse<Map<String, Integer>> markAll() {
        int n = service.markAllRead();
        return ApiResponse.ok(Map.of("updated", n), "Marked " + n + " as read");
    }
}
