
package io.foodtinder.dataservice.utils;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.ExchangeFilterFunction;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;

import io.foodtinder.dataservice.constants.Category;
import io.foodtinder.dataservice.constants.MealArea;
import io.foodtinder.dataservice.model.GeoLocation;
import io.foodtinder.dataservice.model.Meal;
import io.foodtinder.dataservice.model.requests.MealWrapper;
import io.foodtinder.dataservice.model.requests.MultiMatchRequest;
import io.foodtinder.dataservice.model.requests.google.GoogleMapsResponseRestaurant;
import io.foodtinder.dataservice.model.requests.google.GoogleMapsResponseWrapper;
import io.foodtinder.dataservice.model.requests.google.GoogleMapsSingleResultWrapper;
import io.foodtinder.dataservice.repositories.MealRepository;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;
import reactor.netty.http.client.HttpClient;

@Slf4j
@Service
public class RestUtils {

        private WebClient mealServiceWebClient;

        private WebClient mapsServiceWebClient;

        private WebClient userServiceWebClient;

        @Autowired
        private MealRepository mealrepository;

        @PostConstruct
        public void init() {
                log.info("Setting up the yumatch user service webclient instance");
                userServiceWebClient = WebClient.builder()
                                .clientConnector(new ReactorClientHttpConnector(
                                                HttpClient.create().followRedirect(true)))
                                .baseUrl("http://yumatch-user-service:80").filter(logRequest())
                                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                                .defaultHeader(HttpHeaders.USER_AGENT,
                                                "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Safari/537.36")
                                .exchangeStrategies(ExchangeStrategies.builder()
                                                .codecs(configurer -> configurer.defaultCodecs()
                                                                .maxInMemorySize(16 * 1024 * 1024))
                                                .build())
                                .build();
                log.info("Setting up the meal Db service webclient instance");
                mealServiceWebClient = WebClient.builder()
                                .clientConnector(new ReactorClientHttpConnector(
                                                HttpClient.create().followRedirect(true)))
                                .baseUrl("www.themealdb.com").filter(logRequest()) // here is the
                                                                                   // magic
                                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                                .defaultHeader(HttpHeaders.USER_AGENT,
                                                "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Safari/537.36")
                                .exchangeStrategies(ExchangeStrategies.builder()
                                                .codecs(configurer -> configurer.defaultCodecs()
                                                                .maxInMemorySize(16 * 1024 * 1024))
                                                .build())
                                .build();

                if (mealrepository.findAll().size() <= 0) {
                        log.info("No meals in DB yet, initializing repository...");
                        fetchAllMealsForAllCategories();
                        fetchAllMealsForAllAreas();
                }
                mapsServiceWebClient = WebClient.builder()
                                .clientConnector(new ReactorClientHttpConnector(
                                                HttpClient.create().followRedirect(true)))
                                .baseUrl("https://maps.googleapis.com").filter(logRequest()) // here is
                                                                                             // the
                                // magic
                                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                                .defaultHeader(HttpHeaders.USER_AGENT,
                                                "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Safari/537.36")
                                .exchangeStrategies(ExchangeStrategies.builder()
                                                .codecs(configurer -> configurer.defaultCodecs()
                                                                .maxInMemorySize(16 * 1024 * 1024))
                                                .build())
                                .build();
        }

        /**
         * Fetch random meal from mealDB API By: Domenico Ferrari, Minh Vu Nguyen
         */
        public void fetchRandomMealBody() {
                log.info("start call themealdb.com to fetch a random meal");
                MealWrapper response = mealServiceWebClient.get().uri("/api/json/v1/1/random.php")
                                .accept(MediaType.APPLICATION_JSON).retrieve().bodyToMono(MealWrapper.class).block();

                log.info("{}", response);
        }

        /**
         * Fetch meals from MealDB by ingredient
         * 
         * @param ingredient - a string representing the main ingredient
         * @return a MealWrapper containing said meals By: Domenico Ferrari, Minh Vu
         *         Nguyen
         * 
         */
        public MealWrapper fetchMealsByIngredient(String ingredient) {
                log.info("start call themealdb.com to fetch meals by ingredient: {}", ingredient);
                return mealServiceWebClient.get()
                                .uri("https://www.themealdb.com/api/json/v1/1/filter.php?i=" + ingredient)
                                .accept(MediaType.APPLICATION_JSON).retrieve().bodyToMono(MealWrapper.class).block();
        }

        /**
         * API to fetch all meals for all categories and save them to the repository
         */
        public void fetchAllMealsForAllCategories() {
                log.info("Start fetching all meals for all categories");

                List<Meal> allFetchedMeals = new ArrayList<>();
                for (Category category : Category.values()) {
                        log.info("Fetching all meals for category: {}", category);
                        MealWrapper mealsForCategory = mealServiceWebClient.get()
                                        .uri("https://www.themealdb.com/api/json/v1/1/filter.php?c=" + category)
                                        .accept(MediaType.APPLICATION_JSON).retrieve().bodyToMono(MealWrapper.class)
                                        .block();
                        log.info("Result for {}: {}", category, mealsForCategory);
                        log.info("About to save meals to repository");

                        for (Meal meal : mealsForCategory.getMeals()) {
                                Meal foundMeal = mealrepository.getMealByIdMeal(meal.getIdMeal()).orElse(meal);

                                foundMeal.setStrCategory(category);
                                allFetchedMeals.add(foundMeal);
                        }
                        log.info("Finished saving all meals");
                }

                mealrepository.saveAll(allFetchedMeals);
                log.info("Finished saving all meals");
        }

        public void fetchAllMealsForAllAreas() {
                log.info("Start fetching all meals for all categories");

                List<Meal> allFetchedMeals = new ArrayList<>();
                for (MealArea area : MealArea.values()) {
                        log.info("Fetching all meals for area: {}", area);
                        MealWrapper mealsForArea = mealServiceWebClient.get()
                                        .uri("https://www.themealdb.com/api/json/v1/1/filter.php?a=" + area)
                                        .accept(MediaType.APPLICATION_JSON).retrieve().bodyToMono(MealWrapper.class)
                                        .block();
                        log.info("Result for {}: {}", area, mealsForArea);
                        log.info("About to save meals to repository");

                        for (Meal meal : mealsForArea.getMeals()) {
                                Meal foundMeal = mealrepository.getMealByIdMeal(meal.getIdMeal()).orElse(meal);
                                foundMeal.setStrArea(area);
                                allFetchedMeals.add(foundMeal);
                        }
                }
                mealrepository.saveAll(allFetchedMeals);
                log.info("Finished saving all meals");

        }

        /**
         * fetch restaurant to given location and keywords
         * 
         * @param location
         * @param userLang
         * @param keyword
         * @return
         */
        public GoogleMapsResponseWrapper findRestaurants(GeoLocation location, String userLang, String keyword) {
                log.info("Start fetching all restaurants for keywords");

                return mapsServiceWebClient.get()
                                .uri(uriBuilder -> uriBuilder.path("/maps/api/place/nearbysearch/json")
                                                .queryParam("location",
                                                                location.getLatitude() + "," + location.getLongitude())
                                                .queryParam("radius", 1500)
                                                .queryParam("language", userLang)
                                                .queryParam("keyword", keyword)
                                                .queryParam("type", "restaurant")
                                                .queryParam("key", "AIzaSyAJt9waW0hVfZ5bSufYZEGGPNYn6zAviq8")
                                                .build())
                                .retrieve()
                                .onStatus(status -> status.value() == HttpStatus.NOT_FOUND.value(),
                                                response -> Mono.empty())
                                .bodyToMono(GoogleMapsResponseWrapper.class).block();
        }

        /**
         * Internal API to send notifications to all users that are part of the match
         * 
         * @param userIds
         */
        public void sendMultiMatchFinishedNotification(MultiMatchRequest request) {
                userServiceWebClient.post().uri("/notifications/multi/match/finished").bodyValue(request)
                                .retrieve()
                                .toBodilessEntity()
                                .block();
        }

        /**
         * Internal API to send notifications to all users that are part of the match
         * 
         * @param request
         */
        public void sendMultiMatchRequestNotification(MultiMatchRequest request) {
                userServiceWebClient.post().uri("/notifications/multi/match").bodyValue(request)
                                .retrieve()
                                .toBodilessEntity()
                                .block();
        }

        /**
         * fetch all contact data for restaurant
         * 
         * @param restaurantId place_id of restaurant
         * @return {@link GoogleMapsResponseRestaurant}
         */
        public GoogleMapsResponseRestaurant getRestaurantInfo(String restaurantId) {
                log.info("start fetching restaurant info");

                GoogleMapsSingleResultWrapper resp = mapsServiceWebClient.get()
                                .uri(uriBuilder -> uriBuilder.path("/maps/api/place/details/json")
                                                .queryParam("fields",
                                                                "address_component,business_status,formatted_address,geometry,name,place_id,url,vicinity,international_phone_number,formatted_phone_number,opening_hours,website")
                                                .queryParam("place_id", restaurantId)
                                                .queryParam("language", "de")
                                                .queryParam("key", "AIzaSyAJt9waW0hVfZ5bSufYZEGGPNYn6zAviq8")
                                                .build())
                                .retrieve()
                                .onStatus(status -> status.value() == HttpStatus.NOT_FOUND.value(),
                                                response -> Mono.empty())
                                .bodyToMono(GoogleMapsSingleResultWrapper.class).block();
                return resp.getResult();
        }

        // This method returns filter function which will log request data
        private static ExchangeFilterFunction logRequest() {
                return ExchangeFilterFunction.ofRequestProcessor(clientRequest -> {
                        log.info("Request: {} {}", clientRequest.method(), clientRequest.url());
                        clientRequest.headers().forEach(
                                        (name, values) -> values.forEach(value -> log.info("{}={}", name, value)));
                        return Mono.just(clientRequest);
                });
        }

}