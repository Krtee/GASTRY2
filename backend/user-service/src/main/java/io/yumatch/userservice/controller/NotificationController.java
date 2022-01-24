package io.yumatch.userservice.controller;

import lombok.extern.slf4j.Slf4j;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.ArrayList;
import java.util.List;

import com.google.api.services.storage.model.Notification;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import io.yumatch.userservice.constants.NotificationType;
import io.yumatch.userservice.model.DirectNotification;
import io.yumatch.userservice.model.PersistedNotification;
import io.yumatch.userservice.model.TopicNotification;
import io.yumatch.userservice.model.UserDto;
import io.yumatch.userservice.model.UserNotification;
import io.yumatch.userservice.model.requests.MultiMatchRequest;
import io.yumatch.userservice.model.requests.SubscriptionRequest;
import io.yumatch.userservice.repositories.NotificationRepository;
import io.yumatch.userservice.repositories.UserRepository;
import io.yumatch.userservice.utils.FirebaseService;

@RestController
@Slf4j
@CrossOrigin(origins = { "${yumatch.corsHeaderLocal}", "${yumatch.corsHeaderDev}", "${yumatch.corsHeaderProd}" })
@RequestMapping(value = "/notification")
public class NotificationController {

    @Autowired
    FirebaseService firebaseService;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private NotificationRepository notiRepo;

    /**
     * POST API to send notification to single target
     * 
     * @param notification
     * @return 200
     */
    @PostMapping(value = "/")
    public ResponseEntity<Boolean> sendTargetedNotification(@RequestBody DirectNotification notification) {
        log.info("Request to send targeted notification");
        firebaseService.sendNotificationToTarget(notification, null, null, null);

        return ResponseEntity.status(HttpStatus.OK).build();
    }

    /**
     * POST API to send notification to a user, if he has token
     * 
     * @param notification
     * @return 200 otherwise 404 when user or token do not exist
     */
    @PostMapping(value = "/userId")
    public ResponseEntity<Boolean> sendNotificationViaUserId(@RequestBody UserNotification notification) {
        log.info("Request to send notification to user with id:", notification.getUserId());
        UserDto loadedUser = userRepo.findById(notification.getUserId()).orElse(null);
        if (loadedUser == null || loadedUser.getToken().length() <= 0) {
            log.warn("User with id {} not found or has no token ", notification.getUserId());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(false);
        }
        log.info("About to persist notification");
        PersistedNotification persistNotification = new PersistedNotification();
        persistNotification.setTitle(notification.getTitle());
        persistNotification.setMessage(notification.getMessage());
        persistNotification.setUserId(loadedUser.getId());
        persistNotification.setNotificationType(NotificationType.USER);
        notiRepo.save(persistNotification);
        firebaseService.sendNotificationToTarget(
                new DirectNotification(loadedUser.getToken(), notification.getMessage(), notification.getTitle()), null,
                null, null);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    /**
     * GET API to receive all persistent notis belonging to user
     * 
     * @param userId - string representing user id
     */
    @GetMapping(value = "/persistent/all")
    public ResponseEntity<?> getAllPersistentNotificationsForUser(@RequestParam String userId) {
        log.info("Request to get all persistent notis belonging to a user, {}", userId);
        UserDto loadedUser = userRepo.findById(userId).orElse(null);
        if (loadedUser == null) {
            log.warn("User with id {} not found!", userId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.status(HttpStatus.OK).body(notiRepo.findByUserId(userId));

    }

    /**
     * GET API to receive all persitent notifications belonging to user with given
     * type
     * 
     * @param type   - the notification type
     * @param userId - the user id
     * @return
     */
    @GetMapping(value = "/persistent/type")
    public ResponseEntity<?> getAllPersistentNotificationsForUser(@RequestParam NotificationType type,
            @RequestParam String userId) {
        log.info("Request to get all persistent notis belonging to a user with type, {}, {}", userId, type);
        UserDto loadedUser = userRepo.findById(userId).orElse(null);
        if (loadedUser == null) {
            log.warn("User with id {} not found!", userId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.status(HttpStatus.OK).body(notiRepo.findByUserIdAndType(userId, type));

    }

    /**
     * GET API to receive all persitent notifications belonging to user with given
     * seen flag
     * 
     * @param seen   - whether the noti has been seen
     * @param userId - the user id
     * @return
     */
    @GetMapping(value = "/persistent/seen")
    public ResponseEntity<?> getAllPersistentNotificationsForUserBySeen(@RequestParam boolean seen,
            @RequestParam String userId) {
        log.info("Request to get all persistent notis belonging to a user by seen, {}, {}", userId, seen);
        UserDto loadedUser = userRepo.findById(userId).orElse(null);
        if (loadedUser == null) {
            log.warn("User with id {} not found!", userId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.status(HttpStatus.OK).body(notiRepo.findByUserIdAndSeen(userId, seen));

    }

    /**
     * GET API to receive all persitent notifications belonging to user with given
     * seen flag
     * 
     * @param seen   - whether the noti has been seen
     * @param userId - the user id
     * @return
     */
    @PostMapping(value = "/persistent/update")
    public ResponseEntity<?> updatePersistentNotificationSeen(@RequestBody String userId) {
        log.info("Request to update all persistent notis to be seen, {}, {}", userId);
        UserDto loadedUser = userRepo.findById(userId).orElse(null);
        if (loadedUser == null) {
            log.warn("User with id {} not found!", userId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        List<PersistedNotification> notSeenNotifications = notiRepo.findByUserIdAndSeen(userId, false);
        PersistedNotification.updateManySeen(notSeenNotifications);
        notiRepo.saveAll(notSeenNotifications);
        return ResponseEntity.status(HttpStatus.OK).build();

    }

    /**
     * POST API to send notification to all users part of the matching group
     * 
     * @param notification
     * @return 200
     */
    @PostMapping(value = "/multi/match")
    public ResponseEntity<Boolean> sendMultiMatchNotification(@RequestBody MultiMatchRequest request) {
        log.info("Request to send notifications to users in match group");
        List<DirectNotification> notifications = new ArrayList<DirectNotification>();
        request.getUserIds().forEach(userId -> {
            UserDto loadedUser = userRepo.findById(userId).orElse(null);
            if (loadedUser == null) {
                log.warn("User with id {} not found!", userId);
            } else {
                log.info("Creating both notification and persistent notification for page");
                String title = "Sieh dir deinen Yumatch an!";
                String message = "Schaue an was für ein Match deine Freunde und du haben";
                DirectNotification newNotification = new DirectNotification(loadedUser.getToken(), title, message);
                notifications.add(newNotification);
                PersistedNotification persistNotification = new PersistedNotification();
                persistNotification.setTitle(title);
                persistNotification.setMessage(message);
                persistNotification.setUserId(loadedUser.getId());
                persistNotification.setNotificationType(NotificationType.MULTI_MATCH);
                persistNotification.setMatchId(request.getMatchId());
                notiRepo.save(persistNotification);
            }
        });
        firebaseService.sendMultipleNotification(notifications, "matchId", request.getMatchId(), NotificationType.MULTI_MATCH.toString() );
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    /**
     * POST API to send notification to everyone who has subscribed to said topic
     * 
     * @param notification
     * @return 200 when successful
     */
    @PostMapping(value = "/topic/")
    public ResponseEntity<Boolean> sendTopicNotification(@RequestBody TopicNotification notification) {
        log.info("Request to send topic notification");
        PersistedNotification persistNotification = new PersistedNotification();
        persistNotification.setTitle(notification.getTitle());
        persistNotification.setMessage(notification.getMessage());
        persistNotification.setTopic(notification.getTopic());
        persistNotification.setNotificationType(NotificationType.TOPIC);
        notiRepo.save(persistNotification);
        firebaseService.sendNotificationToTopic(notification, null, null, null);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    /**
     * POST API to subscribe a given a given amount of userIds to a topic
     * 
     * @param subscription
     * @return 200 when successful
     */
    @PostMapping(value = "/topic/subscription")
    public ResponseEntity<Boolean> subscribeToTopic(@RequestBody SubscriptionRequest subscription) {
        log.info("Request to subscribe to topic");
        firebaseService.subscribeToTopic(subscription);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

}
