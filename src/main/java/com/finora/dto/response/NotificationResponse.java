package com.finora.dto.response;

import com.finora.entity.NotificationType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class NotificationResponse {
    private Long id;
    private String title;
    private String message;
    private NotificationType type;
    private String referenceId;
    private Boolean isRead;
    private LocalDateTime createdAt;
}
