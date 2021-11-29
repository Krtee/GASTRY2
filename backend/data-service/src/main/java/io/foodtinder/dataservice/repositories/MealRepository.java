package io.foodtinder.dataservice.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import io.foodtinder.dataservice.constants.Category;
import io.foodtinder.dataservice.model.Meal;

public interface MealRepository extends MongoRepository<Meal, String> {

    public Optional<Meal> getMealByStrMeal(String strMeal);

    public Optional<Meal> getMealByStrArea(String strArea);

    public Optional<Meal> getMealByStrTags(String strTags);

    public Optional<Meal> getMealByIdMeal(String idMeal);

    public Optional<List<Meal>> findAllByStrCategory(Category category);
}