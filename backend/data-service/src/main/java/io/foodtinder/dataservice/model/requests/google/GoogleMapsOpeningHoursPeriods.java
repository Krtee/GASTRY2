package io.foodtinder.dataservice.model.requests.google;

import lombok.Data;

@Data
public class GoogleMapsOpeningHoursPeriods {
    private GoogleMapsOpeningHoursPeriods open;
    private GoogleMapsOpeningHoursPeriods close;
}
