package io.foodtinder.dataservice.model.requests;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MultiMatchRequest {
    

    private List<String> userIds = new ArrayList<String>();
    private String matchId;
}
