package io.yumatch.userservice.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
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

import io.yumatch.userservice.constants.ResponseTypes;
import io.yumatch.userservice.constants.UserRole;
import io.yumatch.userservice.model.Buddy;
import io.yumatch.userservice.model.UserDto;
import io.yumatch.userservice.repositories.UserRepository;
import io.yumatch.userservice.utils.BuddyUtil;
import io.yumatch.userservice.utils.KeyCloakService;
import io.yumatch.userservice.utils.RestUtils;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/")
@CrossOrigin(origins = { "${yumatch.corsHeaderLocal}", "${yumatch.corsHeaderDev}", "${yumatch.corsHeaderProd}" })
public class UserController {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private KeyCloakService keycloakUtil;

    @Autowired
    private BuddyUtil buddyUtil;

    @Autowired
    private RestUtils restUtils;

    /**
     * CREATE API to create a new {@link UserDTO}
     * 
     * @param newUser The clientside created instance
     * @return 200 in case of success, 412 in case the {@link UserDTO} could not be
     *         created on keycloak
     */
    @PostMapping(value = "/")
    public ResponseEntity<ResponseTypes> createNewUser(@RequestBody UserDto newUser) {
        log.info("Request to create new user received!");
        newUser.setCreateDate(LocalDateTime.now());
        log.info("this the new user: {}", newUser);

        if (userRepo.findByEmail(newUser.getEmail()).isPresent()) {
            log.warn("User with this mail already exists");

            return ResponseEntity.status(HttpStatus.CONFLICT).body(ResponseTypes.REGISTER_USER_EXISTS_MAIL);

        }

        if (userRepo.findByUsername(newUser.getUsername()).isPresent()) {
            log.warn("User with this username already exists");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ResponseTypes.REGISTER_USER_EXISTS_USERNAME);

        }
        UserDto savedUser = userRepo.save(newUser);
        try {
            int responseStatus = keycloakUtil.createNewUser(savedUser);
            if (responseStatus == 201) {
                return ResponseEntity.status(HttpStatus.CREATED).body(ResponseTypes.SUCCESSFUL);
            }
            userRepo.delete(savedUser);
            log.warn("User creation on keycloak was not successful!");
            return ResponseEntity.status(HttpStatus.PRECONDITION_FAILED).body(ResponseTypes.REGISTER_ERROR);
        } catch (Exception e) {
            userRepo.delete(savedUser);
            log.error("Error creating user on keycloak, error message: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.PRECONDITION_FAILED).body(ResponseTypes.REGISTER_ERROR);
        }

    }

    /**
     * READ API to load all {@link UserDTO} instances
     * 
     * @return 200 with a list of all instances which can be empty
     */
    @GetMapping(value = "/all")
    public ResponseEntity<List<UserDto>> getAllUser() {
        log.info("Request to load all user received");
        return ResponseEntity.status(HttpStatus.OK).body(userRepo.findAll());
    }

    /**
     * READ API to load all {@link UserDTO} instances
     * 
     * @return 200 with a list of all instances which can be empty
     */
    @GetMapping(value = "/all/simple")
    public ResponseEntity<List<UserDto>> getAllSimpleUser() {
        log.info("Request to load all simple user received");
        return ResponseEntity.status(HttpStatus.OK).body(userRepo.loadAllSimpleUser());
    }

    /**
     * READ API to load a single {@link UserDTO} instance by its id
     * 
     * @param userId the id of the instance to fetch
     * @return 200 with a loaded {@link UserDTO} instance which can be null
     */
    @GetMapping(value = "/id")
    public ResponseEntity<UserDto> getUserById(@RequestParam String userId) {
        log.info("Request to load user by id {} received", userId);
        return ResponseEntity.status(HttpStatus.OK).body(userRepo.findById(userId).orElse(null));
    }

    /**
     * READ API to load a list of {@link UserDTO} instance by its id
     * 
     * @param userIds list of ids to fetch
     * @return 200 with a loaded {@link UserDTO} instance which can be null
     */
    @GetMapping(value = "/friends")
    public ResponseEntity<List<UserDto>> getFriendsById(@RequestParam String userId) {
        log.info("Request to load friends of user {} received", userId);
        UserDto loadedUser = userRepo.findById(userId).orElse(null);
        if (loadedUser == null) {
            log.warn("UserDTO with id {} not found to update!", userId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        List<UserDto> listOfUsers = new ArrayList<UserDto>();

        for (Buddy buddy : loadedUser.getBuddies()) {
            listOfUsers.add(userRepo.findSimpleUserById(buddy.getBuddyId()).orElse(null));
        }
        return ResponseEntity.status(HttpStatus.OK).body(listOfUsers.parallelStream()
                .filter(Objects::nonNull)
                .collect(Collectors.toList()));
    }

    /**
     * READ API to load a list of {@link UserDTO} instances inside a match
     * 
     * @param matchId list of ids to fetch
     * @return 200 with a loaded list of {@link UserDTO} which can be empty
     */
    @GetMapping(value = "/multimatch")
    public ResponseEntity<List<UserDto>> getUsersByMatchId(@RequestParam String matchId) {
        log.info("Request to load users for match {} received", matchId);

        List<String> listOfUsers = restUtils.getUserIdsforMatchId(matchId);

        return ResponseEntity.status(HttpStatus.OK)
                .body(listOfUsers.parallelStream()
                        .map(userId -> userRepo.findSimpleUserById(userId).orElse(null))
                        .filter(Objects::nonNull)
                        .collect(Collectors.toList()));
    }

    /**
     * READ API to load a single {@link UserDTO} instance by its username
     * READ API to load favorite Restaurants
     * 
     * @param userId the id to get correct faves
     * @return 200 with a loaded List of restaurants, which can be null
     */
    @GetMapping(value = "/favorite/restaurants")
    public ResponseEntity<UserDto> getFavoriteRestaurants(@RequestParam String userId) {
        log.info("Request to load favorite Restaurants by user id {} received", userId);
        // TODO: When merged restaurant repo!;
        return ResponseEntity.status(HttpStatus.OK).body(userRepo.findById(userId).orElse(null));
    }

    /**
     * READ API to load a single {@link UserDTO} instance by its username
     * 
     * @param username the username of the instance to fetch
     * @return 200 with a loaded {@link UserDTO} instance which can be null
     */
    @GetMapping(value = "/username")
    public ResponseEntity<UserDto> getUserByUsername(@RequestParam String username) {
        log.info("Request to load UserDTO by username {} received", username);
        return ResponseEntity.status(HttpStatus.OK).body(userRepo.findByUsername(username).orElse(null));
    }

    /**
     * READ API to load all {@link UserDTO} instances in a specific role
     * 
     * @param role the role of the instance to fetch
     * @return 200 with loaded {@link UserDTO} instances which can be empty
     */
    @GetMapping(value = "/role")
    public ResponseEntity<List<UserDto>> getAllUserByRole(@RequestParam UserRole role) {
        log.info("Request to load all UserDTO for role {} received", role);
        return ResponseEntity.status(HttpStatus.OK).body(userRepo.findAllByRole(role));
    }

    /**
     * UPDATE API to update a single {@link UserDTO} instance
     * 
     * @param updatedUser The clientside updated instance
     * @return 200 in case of success, 404 in case the instance was not found, 419
     *         in case the keycloak update failed
     */
    @PostMapping(value = "/update")
    public ResponseEntity<Boolean> updateUser(@RequestBody UserDto updatedUser) {
        log.info("Request to update UserDTO {} received", updatedUser);
        UserDto loadedUser = userRepo.findById(updatedUser.getId()).orElse(null);
        if (loadedUser == null) {
            log.warn("UserDTO with id {} not found to update!", updatedUser.getId());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(false);
        }
        if (keycloakUtil.updateKeycloakUser(updatedUser, loadedUser)) {
            loadedUser.update(updatedUser);
            userRepo.save(loadedUser);
            return ResponseEntity.status(HttpStatus.OK).body(true);
        }
        log.warn("Keycloak UserDTO update was not successfull!");
        return ResponseEntity.status(HttpStatus.PRECONDITION_FAILED).body(false);
    }

    /**
     * DELETE API to delete a single {@link UserDTO} instance by its id
     * 
     * @param userId The id of the instance to delete
     * @return 200 in case of success, 404 in case the instance was not found, 419
     *         in case the keycloak deletion failed
     */
    @GetMapping(value = "/delete")
    public ResponseEntity<UserDto> deleteUser(@RequestParam String userId) {
        log.info("Request to delete UserDTO {} received", userId);
        UserDto loadedUser = userRepo.findById(userId).orElse(null);
        if (loadedUser == null) {
            log.warn("UserDTO with id {} not found to delete!", userId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        if (keycloakUtil.deleteUserOnKeycloak(loadedUser)) {
            userRepo.deleteById(userId);
            return ResponseEntity.status(HttpStatus.OK).build();
        }
        buddyUtil.deleteBuddyInAllUsers(userId);
        log.warn("UserDTO was not deleted on keycloak!");
        return ResponseEntity.status(HttpStatus.PRECONDITION_FAILED).build();
    }

    @PostMapping(value = "/delete/all")
    public ResponseEntity<?> deleteAllUser() {
        userRepo.deleteAll();
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
