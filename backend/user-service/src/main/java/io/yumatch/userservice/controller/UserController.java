package io.yumatch.userservice.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.yumatch.userservice.constants.UserRole;
import io.yumatch.userservice.model.UserDto;
import io.yumatch.userservice.repositories.UserRepository;
import io.yumatch.userservice.utils.KeyCloakService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/")
@CrossOrigin(origins = { "*" })
public class UserController {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private KeyCloakService keycloakUtil;

    /**
     * CREATE API to create a new {@link User}
     * 
     * @param newUser The clientside created instance
     * @return 200 in case of success, 412 in case the {@link User} could not be
     *         created on keycloak
     */
    @PostMapping(value = "/")
    public ResponseEntity<String> createNewUser(@RequestBody UserDto newUser) {
        log.info("Request to create new user received!");
        newUser.setCreateDate(LocalDateTime.now());
        UserDto savedUser = userRepo.save(newUser);
        int responseStatus = keycloakUtil.createNewUser(savedUser);
        if (responseStatus == 201) {
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } else if (responseStatus == 409) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("User with this mail exists already");
        }
        log.warn("User creation on keycloak was not successful!");
        userRepo.delete(savedUser);
        return ResponseEntity.status(HttpStatus.PRECONDITION_FAILED).build();
    }

    /**
     * READ API to load all {@link User} instances
     * 
     * @return 200 with a list of all instances which can be empty
     */
    @GetMapping(value = "/all")
    public ResponseEntity<List<UserDto>> getAllUser() {
        log.info("Request to load all user received");
        return ResponseEntity.status(HttpStatus.OK).body(userRepo.findAll());
    }

    /**
     * READ API to load all {@link User} instances
     * 
     * @return 200 with a list of all instances which can be empty
     */
    @GetMapping(value = "/all/simple")
    public ResponseEntity<List<UserDto>> getAllSimpleUser() {
        log.info("Request to load all simple user received");
        return ResponseEntity.status(HttpStatus.OK).body(userRepo.loadAllSimpleUser());
    }

    /**
     * READ API to load a single {@link User} instance by its id
     * 
     * @param userId the id of the instance to fetch
     * @return 200 with a loaded {@link User} instance which can be null
     */
    @GetMapping(value = "/id")
    public ResponseEntity<UserDto> getUserById(@RequestParam String userId) {
        log.info("Request to load user by id {} received", userId);
        return ResponseEntity.status(HttpStatus.OK).body(userRepo.findById(userId).orElse(null));
    }

    /**
     * READ API to load a single {@link User} instance by its username
     * 
     * @param username the username of the instance to fetch
     * @return 200 with a loaded {@link User} instance which can be null
     */
    @GetMapping(value = "/username")
    public ResponseEntity<UserDto> getUserByUsername(@RequestParam String username) {
        log.info("Request to load user by username {} received", username);
        return ResponseEntity.status(HttpStatus.OK).body(userRepo.findByUsername(username).orElse(null));
    }

    /**
     * READ API to load all {@link User} instances in a specific role
     * 
     * @param role the role of the instance to fetch
     * @return 200 with loaded {@link User} instances which can be empty
     */
    @GetMapping(value = "/role")
    public ResponseEntity<List<UserDto>> getAllUserByRole(@RequestParam UserRole role) {
        log.info("Request to load all user for role {} received", role);
        return ResponseEntity.status(HttpStatus.OK).body(userRepo.findAllByRole(role));
    }

    /**
     * UPDATE API to update a single {@link User} instance
     * 
     * @param updatedUser The clientside updated instance
     * @return 200 in case of success, 404 in case the instance was not found, 419
     *         in case the keycloak update failed
     */
    @PostMapping(value = "/update")
    public ResponseEntity<UserDto> updateUser(@RequestBody UserDto updatedUser) {
        log.info("Request to update user {} received", updatedUser);
        UserDto loadedUser = userRepo.findById(updatedUser.getId()).orElse(null);
        if (loadedUser == null) {
            log.warn("User with id {} not found to update!", updatedUser.getId());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        if (keycloakUtil.updateKeycloakUser(updatedUser, loadedUser)) {
            loadedUser.update(updatedUser);
            userRepo.save(loadedUser);
            return ResponseEntity.status(HttpStatus.OK).build();
        }
        log.warn("Keycloak user update was not successfull!");
        return ResponseEntity.status(HttpStatus.PRECONDITION_FAILED).build();
    }

    /**
     * DELETE API to delete a single {@link User} instance by its id
     * 
     * @param userId The id of the instance to delete
     * @return 200 in case of success, 404 in case the instance was not found, 419
     *         in case the keycloak deletion failed
     */
    @GetMapping(value = "/delete")
    public ResponseEntity<UserDto> deleteUser(@RequestParam String userId) {
        log.info("Request to delete user {} received", userId);
        UserDto loadedUser = userRepo.findById(userId).orElse(null);
        if (loadedUser == null) {
            log.warn("User with id {} not found to delete!", userId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        if (keycloakUtil.deleteUserOnKeycloak(loadedUser)) {
            userRepo.deleteById(userId);
            return ResponseEntity.status(HttpStatus.OK).build();
        }
        log.warn("User was not deleted on keycloak!");
        return ResponseEntity.status(HttpStatus.PRECONDITION_FAILED).build();
    }

}
