package io.yumatch.userservice.model;

import lombok.Data;

@Data
public class UserNotification extends Notification {
    private String userId;

    public UserNotification() {
        super();
    }

    public UserNotification(String userId) {
        super();
        this.userId = userId;
    }

    public UserNotification(String userId, String message, String title) {
        super(title, message);
        this.userId = userId;
    }
}
