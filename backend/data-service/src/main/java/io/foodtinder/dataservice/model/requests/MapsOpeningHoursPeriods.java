package io.foodtinder.dataservice.model.requests;

import lombok.Data;

@Data
public class MapsOpeningHoursPeriods {
    private MapsOpeningHoursPeriods open;
    private MapsOpeningHoursPeriods close;
}
