package io.yumatch.userservice.model;


import java.time.LocalDateTime;

import io.yumatch.userservice.constants.BuddyType;
import lombok.Data;

@Data
public class Buddy {

    private LocalDateTime createDate;
    private LocalDateTime lastUpdated;
    private boolean notificationEnabled;
    private String buddyId;
    private BuddyType buddyType;
    /**
     * Helper method to update instance of {@link Buddy}
     * @param updatedBuddy the new buddy
     */
    public void update(Buddy updatedBuddy) {
        this.lastUpdated = LocalDateTime.now();
        this.buddyType = updatedBuddy.getBuddyType();
        this.notificationEnabled = updatedBuddy.isNotificationEnabled();
    }

}
