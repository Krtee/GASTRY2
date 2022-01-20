package io.yumatch.userservice.model.requests;


import io.yumatch.userservice.model.Buddy;
import lombok.Data;

@Data
public class BuddyRequest {
    private String userId;
    private Buddy updatedBuddy;
    private String buddyId;
}
