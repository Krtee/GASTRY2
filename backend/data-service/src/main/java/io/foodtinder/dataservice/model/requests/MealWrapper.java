package io.foodtinder.dataservice.model.requests;

import java.util.List;

import io.foodtinder.dataservice.model.Meal;
import lombok.Data;

@Data
public class MealWrapper {
    private List<Meal> meals;
}
