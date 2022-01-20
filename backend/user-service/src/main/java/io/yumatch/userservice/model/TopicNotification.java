package io.yumatch.userservice.model;

import lombok.Data;

@Data
public class TopicNotification extends Notification{
    private String topic;

    public TopicNotification() {
        super();
    }

    public TopicNotification(String topic, String message, String title) {
        super(title, message);
        this.topic = topic;
    }
}
