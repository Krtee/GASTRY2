package io.foodtinder.dataservice.model.requests;

import java.util.List;

import org.springframework.data.annotation.Id;

import io.foodtinder.dataservice.constants.BusinessStatus;
import lombok.Data;

@Data
public class MapsResponseRestaurant {

    @Id
    private String place_id;
    private BusinessStatus business_status;
    private String name;
    private MapsOpeningHours opening_hours;
    private List<MapsPhotos> photos;
    private int price_level;
    private float rating;
    private int user_ratings_total;
    private String vicinity;
    private String website;
    private List<MapsReview> reviews;
    private String url;
    private List<MapsAddressComponents> address_components;
}
