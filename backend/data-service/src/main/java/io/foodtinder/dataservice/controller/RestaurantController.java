package io.foodtinder.dataservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.foodtinder.dataservice.model.requests.google.GoogleMapsResponseRestaurant;
import io.foodtinder.dataservice.repositories.RestaurantRepository;
import io.foodtinder.dataservice.utils.RestUtils;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/restaurant")
@CrossOrigin(origins = { "*" })
public class RestaurantController {

    @Autowired
    RestaurantRepository restaurantRepo;

    @Autowired
    RestUtils restUtils;

    /**
     * GET API to retrieve info about a restaurant
     * 
     * @param restaurantId id of the restaurant
     * @return {@link GoogleMapsResponseRestaurant}
     */
    @GetMapping(value = "/info")
    public ResponseEntity<GoogleMapsResponseRestaurant> getInfosOfRestaurantById(@RequestParam String restaurantId) {
        log.info("Looking for restaurant with id: {}", restaurantId);
        GoogleMapsResponseRestaurant restaurant = restaurantRepo.findByPlaceId(restaurantId).orElse(null);

        if (restaurant == null) {
            log.info("No restaurant found for said id");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        if (restaurant.getGeometry() == null || restaurant.getInternational_phone_number() == null) {
            GoogleMapsResponseRestaurant moreInfo = restUtils.getRestaurantInfo(restaurantId);
            if (moreInfo != null) {
                restaurant.setAddress_components(moreInfo.getAddress_components());
                restaurant.setBusiness_status(moreInfo.getBusiness_status());
                restaurant.setFormatted_address(moreInfo.getFormatted_address());
                restaurant.setGeometry(moreInfo.getGeometry());
                restaurant.setVicinity(moreInfo.getVicinity());
                restaurant.setInternational_phone_number(moreInfo.getInternational_phone_number());
                restaurant.setFormatted_phone_number(moreInfo.getFormatted_phone_number());
                restaurant.setOpening_hours(moreInfo.getOpening_hours());
                restaurant.setWebsite(moreInfo.getWebsite());
            }
        }
        log.info("Successfully found restaurant");
        return ResponseEntity.status(HttpStatus.OK).body(restaurantRepo.save(restaurant));
    }

}
