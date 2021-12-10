package io.foodtinder.dataservice.model.requests;

import java.util.List;

import lombok.Data;

@Data
public class MapsOpeningHours {
    private boolean open_now;
    private List<String> weekday_text;
    private List<MapsOpeningHours> periods;
}
