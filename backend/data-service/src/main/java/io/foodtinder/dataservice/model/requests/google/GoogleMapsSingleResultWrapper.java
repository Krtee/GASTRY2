package io.foodtinder.dataservice.model.requests.google;

import java.util.List;

import lombok.Data;

@Data
public class GoogleMapsSingleResultWrapper {
    private GoogleMapsResponseRestaurant result;
    private String status;
    private String next_page_token;
    private List<Object> html_attributions;
}
