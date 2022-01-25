package io.foodtinder.dataservice.controller;

import java.time.LocalDateTime;
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
import io.foodtinder.dataservice.model.requests.MultiMatchRequest;
import io.foodtinder.dataservice.repositories.MatchRepository;
import io.foodtinder.dataservice.repositories.MultiUserMatchRepository;
import io.foodtinder.dataservice.utils.MatchUtils;
import io.foodtinder.dataservice.utils.RestUtils;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/group/match")
@CrossOrigin(origins = { "*" })
public class MultiUserMatchController {

    @Autowired
    private MultiUserMatchRepository multiUserMatchRepo;

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private MatchUtils matchUtils;

    @Autowired
    private RestUtils restUtils;

    /**
     * POST API to create a match
     * 
     * @return 200 when successful
     * @author Minh
     */
    @PostMapping(value = "/")
    public ResponseEntity<MultiUserMatch> createGroupMatch(@RequestBody MultiUserMatch newMultiUserMatch) {
        log.info("Request to create group match received", newMultiUserMatch.getCreatorId());
        newMultiUserMatch.setUpdatedAt(LocalDateTime.now());
        newMultiUserMatch.setCreatedAt(LocalDateTime.now());
        for (String matchId : newMultiUserMatch.getMatches()) {
            Match foundMatch = matchRepository.findById(matchId).orElse(null);
            foundMatch.setPartOfGroup(true);
            matchRepository.save(foundMatch);
        }
        restUtils.sendMultiMatchFoundNotification(
                new MultiMatchRequest(
                        newMultiUserMatch.getUserList().stream()
                                .filter(userWrapper -> userWrapper.getStatus() == MultiMatchRequestStatus.ACCEPTED
                                        && userWrapper.getUserId() != newMultiUserMatch.getCreatorId())
                                .map(MultiMatchUserWrapper::getUserId)
                                .collect(Collectors.toList()),
                        newMultiUserMatch.getId()));
        return ResponseEntity.status(HttpStatus.OK).body(multiUserMatchRepo.save(newMultiUserMatch));
    }

    /**
     * Get API to receive match by id
     * 
     * @param id - a string representing the id of a {@link MultiUserMatch}
     * @return 200 when match found, 404 when not found
     * @author Minh
     */
    @GetMapping(value = "/id")
    public ResponseEntity<MultiUserMatch> getMultiUserMatchById(@RequestParam String id) {
        log.info("Looking for match with id: {}", id);
        MultiUserMatch multiUserMatch = multiUserMatchRepo.findById(id).orElse(null);
        if (multiUserMatch != null) {
            log.info("Successfully found match");
            return ResponseEntity.status(HttpStatus.OK).body(multiUserMatch);
        }
        log.info("No match found for said id");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    /**
     * Get API to receive match by single match Id
     * 
     * @param id - a string representing the id of a {@link Match}
     * @return 200 when match found, 404 when not found
     * @author Minh
     */
    @GetMapping(value = "/singlematch/id")
    public ResponseEntity<MultiUserMatch> getMultiUserMatchBySingleMatchId(@RequestParam String matchId) {
        log.info("Looking for match with id: {}", matchId);
        MultiUserMatch multiUserMatch = multiUserMatchRepo.findByMatches(matchId).get(0);
        if (multiUserMatch != null) {
            log.info("Successfully found match");
            return ResponseEntity.status(HttpStatus.OK).body(multiUserMatch);
        }
        log.info("No match found for said id");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    /**
     * GET API - to check if every user finished Matching
     * 
     * @param id - a string representing the id of a {@link MultiUserMatch}
     * @return true if all users finished matching, else returns false
     */
    @GetMapping(value = "/finished")
    public ResponseEntity<Boolean> getMultiUserMatchIsFinished(@RequestParam String id) {
        log.info("Looking for match with id: {}", id);
        MultiUserMatch multiUserMatch = multiUserMatchRepo.findById(id).orElse(null);
        if (multiUserMatch == null) {
            log.info("No match found for said id");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(false);
        }
        return ResponseEntity.status(HttpStatus.OK)
                .body(matchUtils.checkIfAllMatchesAreFinishedInsideMultiUserMatch(multiUserMatch));
    }


    /**
     * POST API to update a group match
     * 
     * @return true when successful, else returns false
     * @author Minh
     */
    @PostMapping(value = "/update")
    public ResponseEntity<Boolean> updateGroupMatch(@RequestBody MultiUserMatch multiUserMatch) {
        log.info("Request to update group match received", multiUserMatch.getCreatorId());
        multiUserMatch.setUpdatedAt(LocalDateTime.now());
        MultiUserMatch multiUserMatchToUpdate = multiUserMatchRepo.findById(multiUserMatch.getId()).orElse(null);
        if (multiUserMatchToUpdate != null) {
            log.info("Successfully found match");
            multiUserMatchRepo.save(multiUserMatch);
            return ResponseEntity.status(HttpStatus.OK).body(true);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(false);

    }
}
