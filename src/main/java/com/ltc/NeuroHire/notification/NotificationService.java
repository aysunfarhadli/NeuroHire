package com.ltc.NeuroHire.notification;

import com.ltc.NeuroHire.common.exception.ApiException;
import com.ltc.NeuroHire.notification.dto.NotificationDto;
import com.ltc.NeuroHire.security.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationService {

    private final NotificationRepository repo;

    /** Push a notification to a target user. Safe to call from any service / event listener. */
    public Notification push(Long userId, String type, String title, String body, String link) {
        Notification n = Notification.builder()
                .userId(userId)
                .type(type)
                .title(title)
                .body(body)
                .link(link)
                .read(false)
                .build();
        return repo.save(n);
    }

    @Transactional(readOnly = true)
    public List<NotificationDto.Item> listForCurrentUser(int limit) {
        Long userId = CurrentUser.get().userId();
        return repo.findByUserIdOrderByCreatedAtDesc(userId, PageRequest.of(0, Math.min(50, Math.max(1, limit))))
                .stream().map(this::toItem).toList();
    }

    @Transactional(readOnly = true)
    public long unreadForCurrentUser() {
        return repo.countByUserIdAndReadFalse(CurrentUser.get().userId());
    }

    public NotificationDto.Item markRead(Long id) {
        Long userId = CurrentUser.get().userId();
        Notification n = repo.findById(id).orElseThrow(() -> ApiException.notFound("Notification not found"));
        if (!n.getUserId().equals(userId)) throw ApiException.forbidden("Not your notification");
        if (!n.isRead()) {
            n.setRead(true);
            repo.save(n);
        }
        return toItem(n);
    }

    public int markAllRead() {
        Long userId = CurrentUser.get().userId();
        List<Notification> unread = repo.findByUserIdOrderByCreatedAtDesc(userId, PageRequest.of(0, 200))
                .stream().filter(n -> !n.isRead()).toList();
        unread.forEach(n -> n.setRead(true));
        repo.saveAll(unread);
        return unread.size();
    }

    private NotificationDto.Item toItem(Notification n) {
        return new NotificationDto.Item(
                n.getId(), n.getType(), n.getTitle(), n.getBody(),
                n.getLink(), n.isRead(), n.getCreatedAt()
        );
    }
}
