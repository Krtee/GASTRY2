package io.foodtinder.dataservice.model;

import org.springframework.data.annotation.Id;

import io.foodtinder.dataservice.constants.Category;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

@Data
@Slf4j
public class Meal {

    @Id
    private String idMeal;
    private String strMeal;
    private Object strDrinkAlternate;
    private Category strCategory;
    private String strArea;
    private String strInstructions;
    private String strMealThumb;
    private String strTags;
    private String strYoutube;
}
