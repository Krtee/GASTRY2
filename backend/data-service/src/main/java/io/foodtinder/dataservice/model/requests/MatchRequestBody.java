package io.foodtinder.dataservice.model.requests;

import io.foodtinder.dataservice.model.GeoLocation;
import io.foodtinder.dataservice.model.Match;
import lombok.Data;

@Data
public class MatchRequestBody {
    private Match match;
    private GeoLocation location;
    private boolean finishedMatching;
}
