package io.yumatch.userservice.model;

import java.util.List;

import org.springframework.data.annotation.Id;

import io.yumatch.userservice.constants.NotificationType;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PersistedNotification extends Notification {
    @Id
    private String id;
    private String data;
    private boolean seen = false;
    private String userId;
    private NotificationType notificationType;
    private String matchId;
    private String userIdRequest;
    private String topic;

    public void updateSeen() {
        this.seen = true;
    }

    public static void updateManySeen(List<PersistedNotification> notifications) {
        notifications.forEach(notification -> {
            notification.updateSeen();
        });
    }

}
