package io.foodtinder.dataservice.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.foodtinder.dataservice.model.MultiMatchUserWrapper;
import io.foodtinder.dataservice.model.MultiUserMatch;
import io.foodtinder.dataservice.repositories.MultiUserMatchRepository;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/internal")
@CrossOrigin(origins = { "*" })
public class InternalController {
    @Autowired
    private MultiUserMatchRepository multiUserMatchRepo;

    /**
     * Get API to receive match by id
     * 
     * @param matchId - a string representing the id of a {@link MultiUserMatch}
     * @return 200 when match found, 404 when not found
     * @author Minh
     */
    @GetMapping(value = "/multimatch/user")
    public ResponseEntity<List<String>> getMultiUserMatchById(@RequestParam String matchId) {
        log.info("Looking for match with id: {}", matchId);
        MultiUserMatch multiUserMatch = multiUserMatchRepo.findById(matchId).orElse(null);
        if (multiUserMatch != null) {
            log.info("Successfully found match");
            return ResponseEntity.status(HttpStatus.OK)
                    .body(multiUserMatch.getUserList().parallelStream().map(MultiMatchUserWrapper::getUserId)
                            .collect(Collectors.toList()));
        }
        log.info("No match found for said id");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
