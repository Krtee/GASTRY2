package io.foodtinder.dataservice.model.requests.google;

import lombok.Data;

@Data
public class GoogleMapsPhotos {
    private int height;
    private int width;
    private String photo_reference;

}
