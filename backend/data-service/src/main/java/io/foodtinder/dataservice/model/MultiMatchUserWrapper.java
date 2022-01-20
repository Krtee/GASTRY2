package io.foodtinder.dataservice.model;

import org.springframework.data.annotation.Id;

import io.foodtinder.dataservice.constants.MultiMatchRequestStatus;
import lombok.Data;

@Data
public class MultiMatchUserWrapper {
    @Id
    private String userId;
    private MultiMatchRequestStatus status;
}
