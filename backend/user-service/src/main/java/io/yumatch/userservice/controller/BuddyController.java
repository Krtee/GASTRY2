package io.yumatch.userservice.controller;

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

import io.yumatch.userservice.YumatchConfig;
import io.yumatch.userservice.constants.BuddyType;
import io.yumatch.userservice.constants.NotificationType;
import io.yumatch.userservice.model.Buddy;
import io.yumatch.userservice.model.DirectNotification;
import io.yumatch.userservice.model.PersistedNotification;
import io.yumatch.userservice.model.UserDto;
import io.yumatch.userservice.model.requests.BuddyRequest;
import io.yumatch.userservice.repositories.NotificationRepository;
import io.yumatch.userservice.repositories.UserRepository;
import io.yumatch.userservice.utils.FirebaseService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/buddy")
@CrossOrigin(origins = { "${yumatch.corsHeaderLocal}", "${yumatch.corsHeaderDev}", "${yumatch.corsHeaderProd}" })
public class BuddyController {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    FirebaseService firebaseService;

    @Autowired
    private NotificationRepository notiRepo;

    @Autowired
    private YumatchConfig config;

    /**
     * CREATE API to add {@link Buddy} to {@link User}
     * 
     * @param buddyId id of buddy to be added
     * @param userId  id of user to have their buddies updated
     * @return 201 in case of success, 412 in case the {@link User} could not be
     *         found
     */
    @PostMapping(value = "/")
    public ResponseEntity<Boolean> addNewBuddy(@RequestBody BuddyRequest buddyRequest) {
        String userId = buddyRequest.getUserId();
        String buddyId = buddyRequest.getBuddyId();
        log.info("Request to add new buddy with id: {}, to user with id: {}", buddyId, userId);
        UserDto loadedUser = userRepo.findById(userId).orElse(null);
        if (loadedUser == null) {
            log.warn("User with id {} not found to add a new buddy!", userId);
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).build();
        }
        UserDto buddyUser = userRepo.findById(buddyId).orElse(null);
        if (buddyUser == null) {
            log.warn("Buddy user with id is missing {}!", buddyId);
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).build();
        }
        buddyUser.addBuddy(userId, BuddyType.INCOMING);
        PersistedNotification persistNotification = new PersistedNotification();
        persistNotification.setTitle(config.getNotification().getBuddyRequestTitle());
        persistNotification.setMessage(config.getNotification().getBuddyRequestText());
        persistNotification.setUserId(buddyUser.getId());
        persistNotification.setNotificationType(NotificationType.BUDDY_REQUEST);
        notiRepo.save(persistNotification);
        if (buddyUser.getToken() != null) {
            firebaseService.sendNotificationToTarget(
                    new DirectNotification(buddyUser.getToken(), config.getNotification().getBuddyRequestText(),
                            config.getNotification().getBuddyRequestTitle()),
                    "userId", loadedUser.getId());
        }

        loadedUser.addBuddy(buddyId, BuddyType.PENDING);
        userRepo.save(loadedUser);
        userRepo.save(buddyUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(true);
    }

    /**
     * DELETE API to delete {@link Buddy} from {@link User}
     * 
     * @param buddyId id of buddy to be removed
     * @param userId  id of user to have their buddies updated
     * @return 200 in case of success, 412 in case the {@link User} could not be
     *         found or buddy not be removed
     */
    @PostMapping(value = "/remove")
    public ResponseEntity<Boolean> removeBuddy(@RequestBody BuddyRequest buddyRequest) {
        String userId = buddyRequest.getUserId();
        String buddyId = buddyRequest.getBuddyId();
        log.info("Request to remove buddy with id: {}, from user with id: {}", buddyId, userId);
        UserDto loadedUser = userRepo.findById(userId).orElse(null);
        if (loadedUser == null) {
            log.warn("User with id {} not found to remove a buddy!", userId);
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).build();
        }
        UserDto buddyUser = userRepo.findById(buddyId).orElse(null);
        if (buddyUser == null) {
            log.warn("Buddy user with id is missing {}!", buddyId);
            loadedUser.removeBuddy(buddyId);
            userRepo.save(loadedUser);
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).build();
        }
        if (loadedUser.removeBuddy(buddyId) && buddyUser.removeBuddy(userId)) {
            userRepo.save(loadedUser);
            userRepo.save(buddyUser);
            return ResponseEntity.status(HttpStatus.OK).body(true);
        }
        return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).build();
    }

    /**
     * API to accept a request
     * 
     * @param userId       the id of the user
     * @param updatedBuddy updated instance of {@link Buddy}
     * @return 200 if successful
     */
    @PostMapping(value = "/accept")
    public ResponseEntity<Boolean> acceptRequest(@RequestBody BuddyRequest buddyRequest) {
        String userId = buddyRequest.getUserId();
        String buddyId = buddyRequest.getBuddyId();
        log.info("Request to accept request for user with id: {}", userId);
        UserDto loadedUser = userRepo.findById(userId).orElse(null);
        if (loadedUser == null) {
            log.warn("User with id {} not found to accept a buddy!", userId);
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).build();
        }
        log.info("Checking if a user with the following buddyId exists: {}", buddyId);
        UserDto buddyUser = userRepo.findById(buddyId).orElse(null);
        if (buddyUser == null) {
            log.warn("Buddy user with id does not exist {}!", buddyId);
            loadedUser.removeBuddy(buddyId);
            userRepo.save(loadedUser);
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).build();
        }

        loadedUser.acceptBuddy(buddyId);
        buddyUser.acceptBuddy(userId);
        userRepo.save(loadedUser);
        userRepo.save(buddyUser);
        return ResponseEntity.status(HttpStatus.OK).body(true);
    }

    /**
     * API to reject Request
     * 
     * @param userId       the id of the user
     * @param updatedBuddy the updated {@link Buddy} instance
     * @return 200 if successful
     */
    @PostMapping(value = "/reject")
    public ResponseEntity<Boolean> rejectRequest(@RequestBody BuddyRequest buddyRequest) {
        String userId = buddyRequest.getUserId();
        String buddyId = buddyRequest.getBuddyId();
        log.info("Request to reject request for user with id: {}", userId);
        UserDto loadedUser = userRepo.findById(userId).orElse(null);
        if (loadedUser == null) {
            log.warn("User with id {} not found to reject a buddy!", userId);
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).build();
        }
        log.info("Checking if a user with the following buddyId exists: {}", buddyId);
        UserDto buddyUser = userRepo.findById(buddyId).orElse(null);
        if (buddyUser == null) {
            log.warn("Buddy user with id does not exist {}!", buddyId);
            loadedUser.removeBuddy(buddyId);
            userRepo.save(loadedUser);
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).build();
        }
        loadedUser.rejectBuddy(buddyId);
        buddyUser.rejectBuddy(userId);
        userRepo.save(loadedUser);
        userRepo.save(buddyUser);
        return ResponseEntity.status(HttpStatus.OK).body(true);

    }

    /**
     * UPDATE API to update own instance of a {@link Buddy}
     * 
     * @param userId       the id of a user
     * @param updatedBuddy the updated buddy instance
     * @retur200 if successful
     */
    @PostMapping(value = "/update")
    public ResponseEntity<Boolean> updateBuddy(@RequestBody BuddyRequest buddyRequest) {
        String userId = buddyRequest.getUserId();
        Buddy updatedBuddy = buddyRequest.getUpdatedBuddy();
        log.info("Request to update buddy instance for user with id: {}", userId);
        UserDto loadedUser = userRepo.findById(userId).orElse(null);
        if (loadedUser == null) {
            log.warn("User with id {} not found!", userId);
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).build();
        }
        log.info("Checking if a user with the following buddyId exists: {}", updatedBuddy.getBuddyId());
        UserDto buddyUser = userRepo.findById(updatedBuddy.getBuddyId()).orElse(null);
        if (buddyUser == null) {
            log.warn("Buddy user with id does not exist {}!", updatedBuddy.getBuddyId());
            loadedUser.removeBuddy(updatedBuddy.getBuddyId());
            userRepo.save(loadedUser);
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).build();
        }
        loadedUser.updateBuddy(updatedBuddy);
        userRepo.save(loadedUser);
        return ResponseEntity.status(HttpStatus.OK).body(true);

    }

    /**
     * GET API to get all {@link Buddy} belonging to a {@link User}
     * 
     * @param userId the id of the user
     * @return the list of buddies
     */
    @GetMapping(value = "/all")
    public ResponseEntity<List<Buddy>> getAllBuddies(@RequestParam String userId) {
        log.info("Request to get all buddies, from user with id: {}", userId);
        UserDto loadedUser = userRepo.findById(userId).orElse(null);
        if (loadedUser == null) {
            log.warn("User with id {} not found to get all buddies!", userId);
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).build();
        }
        return ResponseEntity.status(HttpStatus.OK).body(loadedUser.getBuddies());
    }

}
