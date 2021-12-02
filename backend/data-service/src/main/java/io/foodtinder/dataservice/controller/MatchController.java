package io.foodtinder.dataservice.controller;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;

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

import io.foodtinder.dataservice.model.Match;
import io.foodtinder.dataservice.repositories.MatchRepository;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/meal/")
@CrossOrigin(origins = { "*" })
public class MatchController {

    @Autowired
    private MatchRepository matchRepository;

    /**
     * Get API to receive match by id
     * 
     * @param id - a string representing the id
     * @return 200 when match found, 404 when not found
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
     * 
     * @return 200 when successful, else returns 404
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
        return ResponseEntity.status(HttpStatus.OK).build();
    }

}
