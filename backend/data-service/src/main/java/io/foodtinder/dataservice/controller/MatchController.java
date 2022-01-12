package io.foodtinder.dataservice.controller;

import java.time.LocalDateTime;
import java.util.AbstractMap;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.foodtinder.dataservice.model.GoogleRespSave;
import io.foodtinder.dataservice.model.Match;
import io.foodtinder.dataservice.model.Meal;
import io.foodtinder.dataservice.model.requests.MatchRequestBody;
import io.foodtinder.dataservice.model.requests.google.GoogleMapsResponseRestaurant;
import io.foodtinder.dataservice.model.requests.google.GoogleMapsResponseWrapper;
import io.foodtinder.dataservice.repositories.GoogleRepository;
import io.foodtinder.dataservice.repositories.MatchRepository;
import io.foodtinder.dataservice.utils.RestUtils;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/match")
@CrossOrigin(origins = { "*" })
public class MatchController {

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private GoogleRepository googleRepo;

    @Autowired
    private RestUtils restUtils;

    /**
     * POST API to create a match
     * 
     * @return 200 when successful, else returns 404
     * @author Minh
     */
    @PostMapping(value = "/")
    public ResponseEntity<Match> createMatch(@RequestBody Match newMatch) {
        log.info("Request to create  match  for user {} received", newMatch.getUserId());
        newMatch.setUpdatedAt(LocalDateTime.now());
        newMatch.setCreatedAt(LocalDateTime.now());
        return ResponseEntity.status(HttpStatus.OK).body(matchRepository.save(newMatch));
    }

    /**
     * Get API to receive match by id
     * 
     * @param id - a string representing the id
     * @return 200 when match found, 404 when not found
     * @author Minh
     */
    @GetMapping(value = "/id")
    public ResponseEntity<Match> getMatchById(@RequestParam String id) {
        log.info("Looking for match with id: {}", id);
        Match match = matchRepository.findById(id).orElse(null);
        if (match != null) {
            log.info("Successfully found match");
            return ResponseEntity.status(HttpStatus.OK).body(match);
        }
        log.info("No match found for said id");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

    }

    /**
     * Get API to receive match for user
     * 
     * @param userId - a string representing the userId
     * @return 200 when matches found, 404 when not found
     * @author Minh
     */
    @GetMapping(value = "/user/id")
    public ResponseEntity<List<Match>> getMatchesByUserId(@RequestParam String userId) {
        log.info("Looking for match for user with id {}", userId);
        List<Match> foundMatches = matchRepository.findAllByUserId(userId).orElse(null);
        if (foundMatches != null) {
            log.info("Successfully found match");
            return ResponseEntity.status(HttpStatus.OK).body(foundMatches);
        }
        log.info("No match found for said id");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    /**
     * Get API to receive latest match for user
     * 
     * @param userId - a string representing the userId
     * @return 200 when matches found, 404 when not found
     * @author Minh
     */
    @GetMapping(value = "/user/latest/id")
    public ResponseEntity<Match> getLatestMatchByUserId(@RequestParam String userId) {
        log.info("Looking for match for user with id {}", userId);
        Match latestMatch = matchRepository.findFirstByUserIdOrderByCreatedAtDesc(userId).orElse(null);
        if (latestMatch != null) {
            log.info("Successfully found match");
            return ResponseEntity.status(HttpStatus.OK).body(latestMatch);
        }
        log.info("No match found for said id");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    /**
     * POST API to update update a match
     * 
     * @return 200 when successful, else returns 404
     * @author Minh
     */
    @PostMapping(value = "/update")
    public ResponseEntity<Match> updateMatchbyId(@RequestBody Match updatedMatch) {
        log.info("Request to update  match {} received", updatedMatch.getId());
        Match foundMatch = matchRepository.findById(updatedMatch.getId()).orElse(null);
        if (foundMatch == null) {
            log.warn("Shopfloor board config with id {} not found to update!", updatedMatch.getId());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        foundMatch.update(updatedMatch);
        return ResponseEntity.status(HttpStatus.OK).body(matchRepository.save(foundMatch));
    }

    /**
     * POST API - to match restaurants with given Match object
     * 
     * @param requestBody with matchObject and location
     * @return three matched Restaurants
     * @author minh
     */
    @PostMapping(value = "/restaurant")
    public ResponseEntity<List<GoogleMapsResponseRestaurant>> matchRestaurants(
            @RequestBody MatchRequestBody requestBody) {
        String matchId = requestBody.getMatch().getId();
        log.info("Request to  match restaurants for match {} received", matchId);
        Match foundMatch = matchRepository.findById(matchId).orElse(null);
        if (foundMatch == null) {
            log.warn("Match with id {} not found to update!", matchId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        foundMatch.update(requestBody.getMatch());
        Map<String, Integer> area = new HashMap<>();
        Map<String, Integer> category = new HashMap<>();
        Map<String, Integer> tags = new HashMap<>();

        /**
         * loops through all matched meals and adds area, category and tags to a
         * Key-Value Map. If a key repeats, the value count of that key goes up by one
         */
        for (Meal matchedMeal : foundMatch.getMatchedMeals()) {

            String matchedArea = matchedMeal.getStrArea().name().toLowerCase();
            if (matchedMeal.getStrArea() != null) {
                Integer indexOfArea = area.get(matchedArea);
                if (indexOfArea == null) {
                    area.put(matchedArea, 1);
                } else {
                    area.put(matchedArea, indexOfArea + 1);
                }
            }

            if (matchedMeal.getStrCategory() != null) {

                String matchedCategory = matchedMeal.getStrCategory().name().toLowerCase();
                Integer indexOfCategory = area.get(matchedCategory);
                if (indexOfCategory == null) {
                    category.put(matchedCategory, 1);
                } else {
                    category.put(matchedCategory, indexOfCategory + 1);
                }
            }

            if (matchedMeal.getStrTags() != null) {
                String[] matchedTags = matchedMeal.getStrTags().toLowerCase().split(",");
                for (String matchedTag : matchedTags) {
                    Integer indexOfTags = area.get(matchedTag);
                    if (indexOfTags == null) {
                        tags.put(matchedTag, 1);
                    } else {
                        tags.put(matchedTag, indexOfTags + 1);
                    }
                }
            }

        }

        /**
         * gets all max Value in Key-Value Map
         */
        Map.Entry<String, Integer> maxAreaEntry = null;
        for (Map.Entry<String, Integer> entry : area.entrySet()) {
            if (maxAreaEntry == null || entry.getValue().compareTo(maxAreaEntry.getValue()) > 0) {
                maxAreaEntry = entry;
            }
        }

        if (maxAreaEntry == null) {
            log.warn("no maxCategoryEntry");
            maxAreaEntry = new AbstractMap.SimpleEntry<String, Integer>("", 0);
        }

        Map.Entry<String, Integer> maxCategoryEntry = null;
        for (Map.Entry<String, Integer> entry : category.entrySet()) {
            if (maxCategoryEntry == null || entry.getValue().compareTo(maxCategoryEntry.getValue()) > 0) {
                maxCategoryEntry = entry;
            }
        }
        if (maxCategoryEntry == null) {
            log.warn("no maxCategoryEntry");
            maxCategoryEntry = new AbstractMap.SimpleEntry<String, Integer>("", 0);
        }

        Map.Entry<String, Integer> maxTagEntry = null;
        for (Map.Entry<String, Integer> entry : tags.entrySet()) {
            if (maxTagEntry == null || entry.getValue().compareTo(maxTagEntry.getValue()) > 0) {
                maxTagEntry = entry;
            }
        }
        if (maxTagEntry == null) {
            log.warn("no maxTag");
            maxTagEntry = new AbstractMap.SimpleEntry<String, Integer>("", 0);
        }

        log.info("Looking for respSaves");

        /**
         * looks for saved google Response in repository and returns it
         */
        List<GoogleRespSave> googleRespSave = googleRepo.findByAreaAndCategoryAndTag(maxAreaEntry.getKey(),
                maxCategoryEntry.getKey(), maxTagEntry.getKey());
        if (googleRespSave.size() > 0
                && googleRespSave.get(0) != null
                && googleRespSave.get(0).getGoogleResp() != null
                && googleRespSave.get(0).getGoogleResp().getResults() != null) {
            log.info("found RespSave");

            return ResponseEntity.status(HttpStatus.OK)
                    .body(googleRespSave.get(0).getGoogleResp().getResults().stream().limit(3)
                            .collect(Collectors.toList()));

        }

        log.info("No saved resp found, make new resp");
        /**
         * if no response is found, fetches net google response
         */
        GoogleMapsResponseWrapper newGoogleResp = restUtils.findRestaurants(requestBody.getLocation(), "DE",
                maxAreaEntry.getKey() + "|" + maxCategoryEntry.getKey() + "|" + maxTagEntry.getKey());

        GoogleRespSave newGoogleRespSave = new GoogleRespSave();
        newGoogleRespSave.setGoogleResp(newGoogleResp);
        newGoogleRespSave.setArea(maxAreaEntry.getKey());
        newGoogleRespSave.setCategory(maxCategoryEntry.getKey());
        newGoogleRespSave.setTag(maxTagEntry.getKey());

        googleRepo.save(newGoogleRespSave);

        return ResponseEntity.status(HttpStatus.OK)
                .body(newGoogleResp.getResults().stream().limit(3).collect(Collectors.toList()));

    }

}
