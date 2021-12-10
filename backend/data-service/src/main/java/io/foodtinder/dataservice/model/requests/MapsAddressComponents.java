package io.foodtinder.dataservice.model.requests;

import java.util.List;

import lombok.Data;

@Data
public class MapsAddressComponents {
    private String long_name;
    private String short_name;
    private List<String> types;
}
