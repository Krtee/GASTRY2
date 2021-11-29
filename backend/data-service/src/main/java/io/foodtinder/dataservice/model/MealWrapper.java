package io.foodtinder.dataservice.model;

import java.util.List;

import lombok.Data;

@Data
public class MealWrapper {
    private List<Meal> meals;
}
