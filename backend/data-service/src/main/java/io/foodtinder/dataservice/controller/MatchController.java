package io.foodtinder.dataservice.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
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

import io.foodtinder.dataservice.constants.MultiMatchRequestStatus;
import io.foodtinder.dataservice.model.Match;
import io.foodtinder.dataservice.model.MultiMatchUserWrapper;
import io.foodtinder.dataservice.model.MultiUserMatch;
import io.foodtinder.dataservice.model.requests.MatchRequestBody;
import io.foodtinder.dataservice.model.requests.MultiMatchRequest;
import io.foodtinder.dataservice.repositories.MatchRepository;
import io.foodtinder.dataservice.repositories.MultiUserMatchRepository;
import io.foodtinder.dataservice.utils.MatchUtils;
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
    private MatchUtils matchUtils;

    @Autowired
    private RestUtils restUtils;

    @Autowired
    private MultiUserMatchRepository multiUserMatchRepo;

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
     * POST API to update update a match, if more than 15 meals are matched, finds
     * restaurants. If Match is part of a groupmatch, checks if all users have
     * finished matching and gets a match for groupmatch
     * 
     * @return 200 when successful, else returns 404
     * @author Minh
     */
    @PostMapping(value = "/update")
    public ResponseEntity<Match> updateMatchbyId(@RequestBody MatchRequestBody requestBody) {
        String matchId = requestBody.getMatch().getId();
        log.info("Request to  match restaurants for match {} received", matchId);
        Match foundMatch = matchRepository.findById(matchId).orElse(null);
        if (foundMatch == null) {
            log.warn("match with id {} not found to update!", matchId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        if (requestBody.getLocation() == null || requestBody.getLocation().getLatitude() == 0.0
                || requestBody.getLocation().getLongitude() == 0.0) {
            log.warn("no location!");
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).build();
        }
        log.info("updating match");
        foundMatch.update(requestBody.getMatch());
        if (foundMatch.isPartOfGroup()) {
            log.info("given match is part of a multi user match");
            MultiUserMatch multiUserMatch = multiUserMatchRepo.findByMatches(foundMatch.getId()).get(0);
            if (multiUserMatch != null && matchUtils.checkIfAllMatchesAreFinishedInsideMultiUserMatch(multiUserMatch)) {
                log.info("group match finished");
                List<Match> allMatchesInMultiUserMatch = new ArrayList<Match>();
                for (String multiUserMatchId : multiUserMatch.getMatches()) {
                    Match foundMatchForMultiUser = matchRepository.findById(multiUserMatchId).orElse(null);
                    if (foundMatchForMultiUser != null) {
                        allMatchesInMultiUserMatch.add(foundMatchForMultiUser);
                    }
                    multiUserMatch.setMatchedRestaurants(
                            matchUtils.matchRestaurants(allMatchesInMultiUserMatch, requestBody.getLocation()));
                    multiUserMatch.setUpdatedAt(LocalDateTime.now());
                    restUtils.sendMultiMatchFinishedNotification(
                            new MultiMatchRequest(
                                    multiUserMatch.getUserList().stream()
                                            .filter(userWrapper -> userWrapper
                                                    .getStatus() == MultiMatchRequestStatus.ACCEPTED)
                                            .map(MultiMatchUserWrapper::getUserId)
                                            .collect(Collectors.toList()),
                                    multiUserMatch.getId()));
                    multiUserMatchRepo.save(multiUserMatch);
                }
            }
        } else if (requestBody.isFinishedMatching() && foundMatch.getMatchedRestaurants().size() < 3) {
            log.info("solo match is finished");
            foundMatch
                    .setMatchedRestaurants(matchUtils.matchRestaurants(List.of(foundMatch), requestBody.getLocation()));
            foundMatch.setUpdatedAt(LocalDateTime.now());
        }
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
    public ResponseEntity<Match> matchRestaurants(
            @RequestBody MatchRequestBody requestBody) {
        String matchId = requestBody.getMatch().getId();
        log.info("Request to  match restaurants for match {} received", matchId);
        Match match = requestBody.getMatch();
        match.update(requestBody.getMatch());
        if (match.getMatchedRestaurants().size() >= 3) {
            log.info("match already matched restaurants");
            return ResponseEntity.status(HttpStatus.OK)
                    .body(match);
        }
        match.setMatchedRestaurants(matchUtils.matchRestaurants(List.of(match), requestBody.getLocation()));
        match.setUpdatedAt(LocalDateTime.now());
        return ResponseEntity.status(HttpStatus.OK)
                .body(matchRepository.save(match));
    }

}
