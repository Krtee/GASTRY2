package io.foodtinder.dataservice.model.requests.google;

import java.util.List;

import lombok.Data;

@Data
public class GoogleMapsAddressComponents {
    private String long_name;
    private String short_name;
    private List<String> types;
}
