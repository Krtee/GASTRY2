package io.foodtinder.dataservice.model.user;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;

@Data
@Slf4j
public class User {

    // technical fields
    @Id
    private String id;
    private LocalDateTime createDate;
    private String createdBy;

    private String name;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
}
