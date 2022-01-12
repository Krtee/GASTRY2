package io.foodtinder.dataservice.model.requests.google;

import java.util.List;

import lombok.Data;

@Data
public class GoogleMapsResponseWrapper {
    private List<GoogleMapsResponseRestaurant> results;
    private String status;
    private String next_page_token;
    private List<Object> html_attributions;
}
