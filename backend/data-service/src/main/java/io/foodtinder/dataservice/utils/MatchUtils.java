package io.foodtinder.dataservice.utils;

import java.util.AbstractMap;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.foodtinder.dataservice.constants.MultiMatchRequestStatus;
import io.foodtinder.dataservice.model.GeoLocation;
import io.foodtinder.dataservice.model.GoogleRespSave;
import io.foodtinder.dataservice.model.Match;
import io.foodtinder.dataservice.model.MatchRestaurantWrapper;
import io.foodtinder.dataservice.model.Meal;
import io.foodtinder.dataservice.model.MultiUserMatch;
import io.foodtinder.dataservice.model.requests.google.GoogleMapsResponseRestaurant;
import io.foodtinder.dataservice.model.requests.google.GoogleMapsResponseWrapper;
import io.foodtinder.dataservice.repositories.GoogleRepository;
import io.foodtinder.dataservice.repositories.MatchRepository;
import io.foodtinder.dataservice.repositories.RestaurantRepository;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class MatchUtils {

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private GoogleRepository googleRepo;

    @Autowired
    private RestaurantRepository restaurantRepo;

    @Autowired
    private RestUtils restUtils;

    @Autowired
    private GeneralUtils generalUtils;

    /**
     * returns a Keyword String for given matches
     * 
     * @param matches matches to calculate KeyWords for
     * @return keyword String
     */
    public Map<String, String> getKeyWordStringForMatches(List<Match> matches) {

        Map<String, Integer> area = new HashMap<>();
        Map<String, Integer> category = new HashMap<>();
        Map<String, Integer> tags = new HashMap<>();
        log.info("matches:{}", matches.size());

        /**
         * loops through all matched meals and adds area, category and tags to a
         * Key-Value Map. If a key repeats, the value count of that key goes up by one
         */
        for (Match match : matches) {
            for (Meal matchedMeal : match.getMatchedMeals()) {
                log.info("check meal {}, from {}, which is {}, tags: {}", matchedMeal.getStrMeal(),
                        matchedMeal.getStrArea(), matchedMeal.getStrCategory(), matchedMeal.getStrTags());
                if (matchedMeal.getStrArea() != null) {
                    String matchedArea = matchedMeal.getStrArea().name().toLowerCase();
                    Integer indexOfArea = area.get(matchedArea);
                    if (indexOfArea == null) {
                        area.put(matchedArea, 1);
                    } else {
                        area.put(matchedArea, indexOfArea + 1);
                    }
                }

                if (matchedMeal.getStrCategory() != null) {
                    String matchedCategory = matchedMeal.getStrCategory().name().toLowerCase();
                    Integer indexOfCategory = category.get(matchedCategory);
                    if (indexOfCategory == null) {
                        category.put(matchedCategory, 1);
                    } else {
                        category.put(matchedCategory, indexOfCategory + 1);
                    }
                }

                if (matchedMeal.getStrTags() != null) {
                    String[] matchedTags = matchedMeal.getStrTags().toLowerCase().split(",");
                    for (String matchedTag : matchedTags) {
                        Integer indexOfTags = tags.get(matchedTag);
                        if (indexOfTags == null) {
                            tags.put(matchedTag, 1);
                        } else {
                            tags.put(matchedTag, indexOfTags + 1);
                        }
                    }
                }
            }
        }

        /**
         * gets all max Value in Key-Value Map
         */
        Map.Entry<String, Integer> maxAreaEntry = new AbstractMap.SimpleEntry<String, Integer>("", 0);
        for (Map.Entry<String, Integer> entry : area.entrySet()) {
            if (maxAreaEntry == null || entry.getValue().compareTo(maxAreaEntry.getValue()) > 0) {
                maxAreaEntry = entry;
            }
        }

        Map.Entry<String, Integer> maxCategoryEntry = new AbstractMap.SimpleEntry<String, Integer>("", 0);
        for (Map.Entry<String, Integer> entry : category.entrySet()) {
            if (maxCategoryEntry == null || entry.getValue().compareTo(maxCategoryEntry.getValue()) > 0) {
                maxCategoryEntry = entry;
            }
        }

        Map.Entry<String, Integer> maxTagEntry = new AbstractMap.SimpleEntry<String, Integer>("", 0);
        for (Map.Entry<String, Integer> entry : tags.entrySet()) {
            if (maxTagEntry == null || entry.getValue().compareTo(maxTagEntry.getValue()) > 0) {
                maxTagEntry = entry;
            }
        }

        Map<String, String> result = new HashMap<>();
        result.put("area", maxAreaEntry.getKey());
        result.put("category", maxCategoryEntry.getKey());
        result.put("tag", maxTagEntry.getKey());
        log.info("found keywords, {}, {}, {}", maxAreaEntry.getKey(), maxCategoryEntry.getKey(), maxTagEntry.getKey());
        return result;

    }

    /**
     * checks if all users inside {@link MultiUserMatch} finished matching
     * 
     * @param multiUserMatch match to check
     * @return true if all users finished matching, else returns false
     */
    public boolean checkIfAllMatchesAreFinishedInsideMultiUserMatch(MultiUserMatch multiUserMatch) {

        List<Match> matches = multiUserMatch.getMatches()
                .stream()
                .map(matchId -> matchRepository.findById(matchId).orElse(null))
                .filter(Objects::nonNull).collect(Collectors.toList());

        if (multiUserMatch.getUserList()
                .parallelStream()
                .filter((userWrapper) -> {
                    Match foundMatch = matches
                            .stream()
                            .filter(match -> userWrapper.getStatus() == MultiMatchRequestStatus.ACCEPTED
                                    && match.getUserId() == userWrapper.getUserId())
                            .findFirst()
                            .orElse(null);
                    if (foundMatch == null
                            || (foundMatch.getMatchedMeals().size() + foundMatch.getUnmatchedMeals().size()) < 15) {
                        return true;
                    }
                    return false;
                }).findAny().isPresent()) {
            log.info("Matching is not finished");
            return false;
        }
        return true;
    }

    /**
     * method to match restaurants
     * 
     * @param matches  list of all matches to consider
     * @param location location of user
     * @return list of restaurants as {@link MatchRestaurantWrapper}
     */
    public List<MatchRestaurantWrapper> matchRestaurants(List<Match> matches, GeoLocation location) {

        Map<String, String> maxValues = getKeyWordStringForMatches(matches);
        /**
         * looks for saved google Response in repository and returns it
         */
        List<GoogleRespSave> googleRespSaveList = googleRepo.findFirstByAreaAndCategoryAndTag(maxValues.get("area"),
                maxValues.get("category"), maxValues.get("tag"));

        if (googleRespSaveList.size() < 0
                && googleRespSaveList.get(0) != null
                && googleRespSaveList.get(0).getRestaurants() != null) {
            for (GoogleRespSave save : googleRespSaveList) {
                if (generalUtils.distance(save.getLocation().getLatitude(), location.getLatitude(),
                        save.getLocation().getLongitude(), location.getLongitude()) > 2000) {
                    log.info("found saved response");

                    List<GoogleMapsResponseRestaurant> restaurantsToReturn = new ArrayList<GoogleMapsResponseRestaurant>();

                    int indexOfRestaurantId = 0;
                    while (restaurantsToReturn.size() <= 10) {
                        GoogleMapsResponseRestaurant tempRestaurant = restaurantRepo
                                .findByPlaceId(save.getRestaurants().get(indexOfRestaurantId)).orElse(null);

                        if (tempRestaurant != null) {
                            restaurantsToReturn
                                    .add(tempRestaurant);
                        }
                        indexOfRestaurantId++;
                    }
                    return mapGoogleRestaurantsToWrapper(restaurantsToReturn);
                }
            }
        }

        GoogleRespSave googleRespSave = new GoogleRespSave();
        /**
         * if no response is found, fetches net google response
         */
        GoogleMapsResponseWrapper newGoogleResp = restUtils.findRestaurants(location, "de",
                maxValues.get("area") + " " + maxValues.get("category"));

        if (newGoogleResp.getResults().size() <= 3) {
            log.info("recall maps, because no restaurant was found");
            newGoogleResp = restUtils.findRestaurants(location, "de",
                    maxValues.get("area"));
        }

        googleRespSave = new GoogleRespSave();
        googleRespSave.setRestaurants(newGoogleResp.getResults()
                .stream()
                .map(GoogleMapsResponseRestaurant::getPlace_id)
                .collect(Collectors.toList()));
        googleRespSave.setArea(maxValues.get("area"));
        googleRespSave.setCategory(maxValues.get("category"));
        googleRespSave.setTag(maxValues.get("tag"));
        googleRespSave.setLocation(location);
        googleRepo.save(googleRespSave);

        List<GoogleMapsResponseRestaurant> restaurantsToSave = new ArrayList<GoogleMapsResponseRestaurant>();

        for (GoogleMapsResponseRestaurant restaurantToSave : newGoogleResp.getResults()) {
            GoogleMapsResponseRestaurant foundRestaurant = restaurantRepo.findByPlaceId(restaurantToSave.getPlace_id())
                    .orElse(null);
            if (foundRestaurant == null) {
                log.info("saving restaurant {}", restaurantToSave.getName());
                restaurantsToSave.add(restaurantToSave);
            }
            ;
        }
        restaurantRepo.saveAll(restaurantsToSave);

        return mapGoogleRestaurantsToWrapper(
                newGoogleResp.getResults()
                        .stream()
                        .limit(10)
                        .collect(Collectors.toList()));

    }

    /**
     * maps restaurants to a {@link MatchRestaurantWrapper} object
     * 
     * @param restaurants to map
     * @return {@link MatchRestaurantWrapper}
     * @author Minh
     */
    public List<MatchRestaurantWrapper> mapGoogleRestaurantsToWrapper(List<GoogleMapsResponseRestaurant> restaurants) {

        List<MatchRestaurantWrapper> restaurantWrappers = new ArrayList<MatchRestaurantWrapper>();

        for (int i = 0; i < restaurants.size(); i++) {
            MatchRestaurantWrapper newWrapper = new MatchRestaurantWrapper();
            newWrapper.setRestaurant(restaurants.get(i));
            newWrapper.setIndex(i);
            restaurantWrappers.add(newWrapper);
        }

        return restaurantWrappers;
    }
}
