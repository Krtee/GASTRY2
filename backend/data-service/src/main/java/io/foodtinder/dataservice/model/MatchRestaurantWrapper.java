package io.foodtinder.dataservice.model;

import io.foodtinder.dataservice.model.requests.google.GoogleMapsResponseRestaurant;
import lombok.Data;

@Data
public class MatchRestaurantWrapper {

    private GoogleMapsResponseRestaurant restaurant;
    private int index;
}
