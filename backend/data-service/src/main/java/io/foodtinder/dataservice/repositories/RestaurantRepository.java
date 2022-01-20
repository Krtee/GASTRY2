package io.foodtinder.dataservice.repositories;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import io.foodtinder.dataservice.model.requests.google.GoogleMapsResponseRestaurant;

public interface RestaurantRepository extends MongoRepository<GoogleMapsResponseRestaurant, String> {

    @Query(value = "{'place_id':?0}")
    Optional<GoogleMapsResponseRestaurant> findByPlaceId(String placeId);
}