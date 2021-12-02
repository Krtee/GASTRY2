package io.foodtinder.dataservice.model;

import java.util.List;

import org.springframework.data.annotation.Id;

import io.foodtinder.dataservice.constants.Category;
import lombok.Data;

@Data
public class Restaurant {

    @Id
    private String id;
    private String street;
    private String city;
    private String zip;
    private String country;
    private List<Category> categories;
    private String name;
    private String phone;
    private String email;
}
