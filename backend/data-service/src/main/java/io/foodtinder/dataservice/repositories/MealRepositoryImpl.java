package io.foodtinder.dataservice.repositories;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.SampleOperation;
import org.springframework.data.mongodb.core.aggregation.TypedAggregation;

import io.foodtinder.dataservice.model.Meal;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class MealRepositoryImpl implements MealOperations {
    @Autowired
    private MongoOperations mongo;

    /**
     * DB-Method to fetch random meals. meals are not unique!
     * 
     * @param count how many meals should be fetched
     * @return list of random {@link Meal}
     * @author minh
     */
    @Override
    public List<Meal> getRandomMeals(int count) {
        SampleOperation matchStage = Aggregation.sample(count);
        TypedAggregation<Meal> aggregation = TypedAggregation.newAggregation(Meal.class, matchStage);
        List<Meal> results = mongo.aggregate(aggregation, Meal.class).getMappedResults();
        for (Meal i : results) {
            log.info(i.getStrMeal());
        }
        return results;
    }
}
