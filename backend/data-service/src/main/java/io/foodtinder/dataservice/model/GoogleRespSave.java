package io.foodtinder.dataservice.model;

import io.foodtinder.dataservice.model.requests.google.GoogleMapsResponseWrapper;
import lombok.Data;

@Data
public class GoogleRespSave {

    private GoogleMapsResponseWrapper googleResp;
    private String area;
    private String category;
    private String tag;
}
