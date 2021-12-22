package io.foodtinder.dataservice.model.requests.google;

import java.util.List;

import lombok.Data;

@Data
public class GoogleMapsResponseWrapper {
    private List<GoogleMapsResponseRestaurant> results;
}
