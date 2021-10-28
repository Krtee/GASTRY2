package io.foodtinder.dataservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.foodtinder.dataservice.model.user.User;
import io.foodtinder.dataservice.repositories.UserRepository;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/user/")
public class UserController {
    
    @Autowired
    private UserRepository userRepository;

    private User user = new User();

    /**
     * Demo API for creating a User
     * @return 200 with confirmation of new user
     * By: Domenico Ferrari
     */
    @PostMapping(value = "/demo")
    public ResponseEntity<User> createDemoUser() {
        log.info("Creating Demo user...");
        user.setName("MongoUser");
        return ResponseEntity.status(HttpStatus.OK).body(userRepository.save(user));
        
    }
    /**
     * Demo api for retrieving demo user
     * @return demo user {@link User}  
     * By: Domenico Ferrari
     */
    @GetMapping(value = "/demo")
    public ResponseEntity<User> getDemoUser() {
        log.info("Getting Demo user...");
        return ResponseEntity.status(HttpStatus.OK).body(userRepository.findByName("MongoUser").orElse(null));
    }

}

