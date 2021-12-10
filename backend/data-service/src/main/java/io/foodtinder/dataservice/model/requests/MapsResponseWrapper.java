package io.foodtinder.dataservice.model.requests;

import java.util.List;

import lombok.Data;

@Data
public class MapsResponseWrapper {
    private List<MapsResponseRestaurant> results;
}
