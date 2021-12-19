package io.foodtinder.dataservice.controller;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Comparator;
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
@RequestMapping("/meal/")
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
        List<Match> foundMatches = matchRepository.findAllByUserId(userId).orElse(null);
        if (foundMatches != null) {
            log.info("Successfully found match");
            Match latestMatch = Collections.max(foundMatches, Comparator.comparing(match -> match.getCreatedAt()));
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
        matchRepository.save(foundMatch);
        return ResponseEntity.status(HttpStatus.OK).body(matchRepository.save(foundMatch));
    }

    @PostMapping(value = "/match")
    public ResponseEntity<List<GoogleMapsResponseRestaurant>> matchRestaurants(
            @RequestBody MatchRequestBody requestBody) {
        log.info("Request to  match restaurants for match {} received", requestBody.getUpdatedMatch().getId());
        Match foundMatch = matchRepository.findById(requestBody.getUpdatedMatch().getId()).orElse(null);
        if (foundMatch == null) {
            log.warn("Shopfloor board config with id {} not found to update!", requestBody.getUpdatedMatch().getId());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        foundMatch.update(requestBody.getUpdatedMatch());
        Map<String, Integer> area = new HashMap<>();
        Map<String, Integer> category = new HashMap<>();
        Map<String, Integer> tags = new HashMap<>();

        for (Meal matchedMeal : foundMatch.getMatchedMeals()) {
            String matchedArea = matchedMeal.getStrArea().name().toLowerCase();
            Integer indexOfArea = area.get(matchedArea);
            if (indexOfArea == null) {
                area.put(matchedArea, 1);
            } else {
                area.put(matchedArea, indexOfArea + 1);
            }

            String matchedCategory = matchedMeal.getStrCategory().name().toLowerCase();
            Integer indexOfCategory = area.get(matchedCategory);
            if (indexOfCategory == null) {
                category.put(matchedCategory, 1);
            } else {
                category.put(matchedCategory, indexOfCategory + 1);
            }

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

        Map.Entry<String, Integer> maxAreaEntry = null;
        for (Map.Entry<String, Integer> entry : area.entrySet()) {
            if (maxAreaEntry == null || entry.getValue().compareTo(maxAreaEntry.getValue()) > 0) {
                maxAreaEntry = entry;
            }
        }

        Map.Entry<String, Integer> maxCategoryEntry = null;
        for (Map.Entry<String, Integer> entry : category.entrySet()) {
            if (maxCategoryEntry == null || entry.getValue().compareTo(maxCategoryEntry.getValue()) > 0) {
                maxCategoryEntry = entry;
            }
        }

        Map.Entry<String, Integer> maxTagEntry = null;
        for (Map.Entry<String, Integer> entry : tags.entrySet()) {
            if (maxTagEntry == null || entry.getValue().compareTo(maxTagEntry.getValue()) > 0) {
                maxTagEntry = entry;
            }
        }
        GoogleRespSave googleRespSave = googleRepo.findAllbyAreaAndCategoryAndTag(maxAreaEntry.getKey(),
                maxCategoryEntry.getKey(), maxTagEntry.getKey()).get(0);
        if (googleRespSave != null) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(googleRespSave.getGoogleResp().getResults().stream().limit(3).collect(Collectors.toList()));
        }

        GoogleMapsResponseWrapper newGoogleResp = restUtils.findRestaurants(requestBody.getLocation(), "DE",
                maxAreaEntry.getKey() + " " + maxCategoryEntry.getKey() + " " + maxTagEntry.getKey());

        googleRespSave = new GoogleRespSave();
        googleRespSave.setGoogleResp(newGoogleResp);
        googleRespSave.setArea(maxAreaEntry.getKey());
        googleRespSave.setCategory(maxCategoryEntry.getKey());
        googleRespSave.setTag(maxTagEntry.getKey());

        googleRepo.save(googleRespSave);

        return ResponseEntity.status(HttpStatus.OK)
                .body(newGoogleResp.getResults().stream().limit(3).collect(Collectors.toList()));

    }

}
