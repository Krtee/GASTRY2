package io.foodtinder.dataservice.model.requests.google;

import lombok.Data;

@Data
public class GoogleMapsReview {
    private String author_name;
    private String rating;
    private String relative_time_description;
    private int time;
    private String profile_photo_url;
    private String text;
}
