package io.foodtinder.dataservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.foodtinder.dataservice.repositories.GoogleRepository;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/respsave")
@CrossOrigin(origins = { "*" })
public class GoogleRespSaveController {

    @Autowired
    GoogleRepository googleRepo;

    /**
     * deletes all available respsaves
     */
    @PostMapping(value = "/delete/all")
    public ResponseEntity<?> deleteAllRespSaves() {
        log.warn("request to delete all RespSaves received");
        googleRepo.deleteAll();
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    /**
     * GET API - to fetch all available respsaves
     */
    @GetMapping(value = "/all")
    public ResponseEntity<?> fetchAllRespSaves() {
        log.warn("request to delete all RespSaves received");
        return ResponseEntity.status(HttpStatus.OK).body(googleRepo.findAll());
    }
}
