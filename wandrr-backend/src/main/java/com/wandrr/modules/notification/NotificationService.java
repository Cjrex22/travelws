package com.wandrr.modules.notification;

import com.wandrr.modules.user.User;
import com.wandrr.modules.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationService {
    
    private final NotificationRepository notificationRepository;
    private final UserService userService;
    
    public List<Notification> getMyNotifications(String email) {
        User user = userService.getUserEntityByEmail(email);
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }
    
    public long getUnreadCount(String email) {
        User user = userService.getUserEntityByEmail(email);
        return notificationRepository.countByUserIdAndIsReadFalse(user.getId());
    }
    
    @Transactional
    public void markAsRead(UUID id, String email) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
                
        User user = userService.getUserEntityByEmail(email);
        if (!notification.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to modify this notification");
        }
        
        notification.setRead(true);
        notificationRepository.save(notification);
    }
    
    public Notification createNotification(UUID targetUserId, String type, String message, UUID referenceId) {
        User user = userService.getUserEntityById(targetUserId);
        Notification notification = Notification.builder()
                .user(user)
                .type(type)
                .message(message)
                .referenceId(referenceId)
                .build();
        return notificationRepository.save(notification);
    }
}
