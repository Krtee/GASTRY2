package io.foodtinder.dataservice.model;

import org.springframework.data.annotation.Id;

import lombok.Data;

@Data
public class Post {
    @Id
    private String id;
    private String content;
    private String userId;
}
