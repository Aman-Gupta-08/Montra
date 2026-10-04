package com.finora.repository;

import com.finora.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    List<Notification> findByUserIdAndIsReadFalseOrderByCreatedAtDesc(Long userId);
    
    Optional<Notification> findByIdAndUserId(Long id, Long userId);
    
    boolean existsByUserIdAndReferenceIdAndType(Long userId, String referenceId, com.finora.entity.NotificationType type);
}
