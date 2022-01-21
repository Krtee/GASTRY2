package io.foodtinder.dataservice.model;

import java.util.List;

import lombok.Data;

@Data
public class GoogleRespSave {

    private List<String> restaurants;
    private String area;
    private String category;
    private String tag;
    private GeoLocation location;
}
