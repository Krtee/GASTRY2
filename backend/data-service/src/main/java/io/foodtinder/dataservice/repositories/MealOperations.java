package io.foodtinder.dataservice.repositories;

import java.util.List;

import io.foodtinder.dataservice.model.Meal;

public interface MealOperations {

    public List<Meal> getRandomMeals(int count);

}
