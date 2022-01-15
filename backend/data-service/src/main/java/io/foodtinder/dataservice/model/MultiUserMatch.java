package io.foodtinder.dataservice.model;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;

import lombok.Data;

@Data
public class MultiUserMatch {
    @Id
    private String id;
    private List<String> userIds;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<String> matches;
    private String creatorId;
    private List<MatchRestaurantWrapper> matchedRestaurants;
    private boolean isActive;

}
