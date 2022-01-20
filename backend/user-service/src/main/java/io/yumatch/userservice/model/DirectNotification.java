package io.yumatch.userservice.model;

import lombok.Data;

@Data
public class DirectNotification extends Notification {
    private String target;

    public DirectNotification() {
        super();
    }

    public DirectNotification(String target, String message, String title) {
        super(title, message);
        this.target = target;
    }

}
