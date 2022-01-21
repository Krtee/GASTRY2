package io.yumatch.userservice.model.requests;


import java.util.List;

import lombok.Data;

@Data
public class SubscriptionRequest {
    private List<String> subscriberIds;
    private String topic;
}
