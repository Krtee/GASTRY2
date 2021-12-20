package io.foodtinder.dataservice.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.foodtinder.dataservice.constants.Category;
import io.foodtinder.dataservice.model.Meal;
import io.foodtinder.dataservice.repositories.MealRepository;
import io.foodtinder.dataservice.utils.RestUtils;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/meal")
@CrossOrigin(origins = { "*" })
public class MealController {

    @Autowired
    private MealRepository mealRepository;

    @Autowired
    private RestUtils restUtils;

    /**
     * A GET API to retrieve all meals
     * 
     * @return 200 with meals
     */
    @GetMapping(value = "/all")
    public ResponseEntity<List<Meal>> getAllMeals() {
        log.info("Retrieving all meals saved on database...");
        return ResponseEntity.status(HttpStatus.OK).body(mealRepository.findAll());

    }

    /**
     * A GET API to retrieve random meals
     * 
     * @param count how many meals should get fetched
     * @return 200 with a list of random {@link Meal}
     */
    @GetMapping(value = "/some")
    public ResponseEntity<List<Meal>> getSomeMeals(@RequestParam int count) {
        log.info("Retrieving {} meals saved on database...", count);

        return ResponseEntity.status(HttpStatus.OK).body(mealRepository.getRandomMeals(count));

    }

    /**
     * Test API for deleting all meals from the repository
     * 
     * @return 200 when all entries have been deleted
     */
    @GetMapping(value = "/delete/all")
    public ResponseEntity<?> deteleAllMeals() {
        mealRepository.deleteAll();
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    /**
     * Get API to receive meal by id
     * 
     * @param id - a string representing the id
     * @return 200 when meal found, 404 when not found
     */
    @GetMapping(value = "/id")
    public ResponseEntity<Meal> getMealById(@RequestParam String id) {
        log.info("Looking for meal with id: {}", id);
        Meal meal = mealRepository.findById(id).orElse(null);
        if (meal != null) {
            log.info("Successfully found meal");
            return ResponseEntity.status(HttpStatus.OK).body(meal);
        }
        log.info("No meal found for said id");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

    }

    /**
     * Get API to receive meal by category
     * 
     * @param id - a string representing the category
     * @return 200 when meal found, 404 when not found
     */
    @GetMapping(value = "/category")
    public ResponseEntity<List<Meal>> getMealByCategory(@RequestParam Category category) {
        log.info("Looking for meal with id: {}", category);
        List<Meal> meals = mealRepository.findAllByStrCategory(category).orElse(null);
        if (meals != null) {
            log.info("Successfully found meals for given category: {}", category);
            return ResponseEntity.status(HttpStatus.OK).body(meals);
        }
        log.info("No meals found for given Category");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

    }

    /**
     * Get API to receive all meals by given ingredient and exclude given ingredient
     * 
     * @param ingredient - a string representing the ingredient
     * @return 200 when meals found, 404 when none found
     */
    @GetMapping(value = "/ingredient")
    public ResponseEntity<List<Meal>> getMealsByIngredient(@RequestParam String ingredient) {
        List<Meal> meals = restUtils.fetchMealsByIngredient(ingredient).getMeals();
        log.info("Call to rest util finished, response: {}", meals);
        if (meals != null) {
            log.info("Successfully found meals with said ingredient");
            return ResponseEntity.status(HttpStatus.OK).body(meals);
        }
        log.info("No meals found for said ingredient");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

    }

}
