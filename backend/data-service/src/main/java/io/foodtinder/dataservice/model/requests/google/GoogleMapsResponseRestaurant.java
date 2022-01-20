package io.foodtinder.dataservice.model.requests.google;

import java.util.List;

import org.springframework.data.annotation.Id;

import io.foodtinder.dataservice.constants.BusinessStatus;
import lombok.Data;

@Data
public class GoogleMapsResponseRestaurant {

    @Id
    private String place_id;
    private BusinessStatus business_status;
    private String name;
    private GoogleMapsOpeningHours opening_hours;
    private List<GoogleMapsPhotos> photos;
    private int price_level;
    private float rating;
    private int user_ratings_total;
    private String vicinity;
    private String website;
    private List<GoogleMapsReview> reviews;
    private String url;
    private List<GoogleMapsAddressComponents> address_components;
    private String formatted_address;
    private GoogleMapsGeometryWrapper geometry;
    private String international_phone_number;
    private String formatted_phone_number;

}
