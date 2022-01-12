package io.foodtinder.dataservice.model.requests.google;

import java.util.List;

import lombok.Data;

@Data
public class GoogleMapsOpeningHours {
    private boolean open_now;
    private List<String> weekday_text;
    private List<GoogleMapsOpeningHours> periods;
}
