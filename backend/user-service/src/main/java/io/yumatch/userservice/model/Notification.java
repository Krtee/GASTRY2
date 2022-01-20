package io.yumatch.userservice.model;

import lombok.Data;

@Data
public class Notification {
    private String title;
    private String message;

    public Notification() {
        
    }


    public Notification(String title, String message) {
        this.title = title;
        this.message = message;
    }
}



