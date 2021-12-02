package io.foodtinder.dataservice.model;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;

import lombok.Data;

@Data
public class Match {

    @Id
    private String id;
    private String userId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<Meal> matchedMeals;
    private List<Meal> unmatchedMeals;
    private List<MatchRestaurantWrapper> matchedRestaurants;

    public void update(Match updatedMatch) {
        this.setMatchedMeals(updatedMatch.getMatchedMeals());
        this.setUnmatchedMeals(updatedMatch.getUnmatchedMeals());
        this.setMatchedRestaurants(updatedMatch.matchRestaurants());
        this.setUpdatedAt(LocalDateTime.now());
    }

    public List<MatchRestaurantWrapper> calculateMatch() {

        return this.getMatchedRestaurants();
    }

    public List<MatchRestaurantWrapper> matchRestaurants() {
        // TODO get right matches
        return this.getMatchedRestaurants();
    }

}
