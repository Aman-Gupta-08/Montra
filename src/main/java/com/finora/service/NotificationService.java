package com.finora.service;

import com.finora.dto.response.NotificationResponse;
import com.finora.entity.Notification;
import com.finora.entity.NotificationType;
import com.finora.entity.User;
import com.finora.exception.ResourceNotFoundException;
import com.finora.repository.NotificationRepository;
import com.finora.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public List<NotificationResponse> getAllNotifications(String email) {
        User user = getUser(email);
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<NotificationResponse> getUnreadNotifications(String email) {
        User user = getUser(email);
        return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    @SuppressWarnings("null")
    public void createNotification(User user, String title, String message, NotificationType type, String referenceId) {
        // Prevent duplicate overdue notifications for the same reference
        if (type == NotificationType.LOAN_OVERDUE) {
            boolean exists = notificationRepository.existsByUserIdAndReferenceIdAndType(user.getId(), referenceId, type);
            if (exists) {
                return;
            }
        }

        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .referenceId(referenceId)
                .isRead(false)
                .build();
        
        notificationRepository.save(notification);
    }

    @Transactional
    @SuppressWarnings("null")
    public NotificationResponse markAsRead(Long id, String email) {
        User user = getUser(email);
        Notification notification = notificationRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        
        notification.setIsRead(true);
        notification = notificationRepository.save(notification);
        return mapToResponse(notification);
    }

    @Transactional
    @SuppressWarnings("null")
    public void markAllAsRead(String email) {
        User user = getUser(email);
        List<Notification> unread = notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(user.getId());
        unread.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(unread);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private NotificationResponse mapToResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .type(notification.getType())
                .referenceId(notification.getReferenceId())
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
