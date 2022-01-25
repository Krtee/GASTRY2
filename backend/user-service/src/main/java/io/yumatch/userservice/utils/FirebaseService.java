package io.yumatch.userservice.utils;

import java.util.ArrayList;
import java.util.List;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.WebpushConfig;
import com.google.firebase.messaging.WebpushNotification;

import org.springframework.stereotype.Service;

import io.yumatch.userservice.model.DirectNotification;
import io.yumatch.userservice.model.TopicNotification;
import io.yumatch.userservice.model.requests.SubscriptionRequest;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;

import javax.annotation.Nullable;
import javax.annotation.PostConstruct;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;

@Slf4j
@Service
public class FirebaseService {

    @Value("${yumatch.firebasePath}")
    String firebasePath;

    @Value("${yumatch.notificationIcon}")
    String notificationIcon;

    @PostConstruct
    public void init() throws Exception {

        try {
            log.info("Initializing firebase app");
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(
                            GoogleCredentials.fromStream(new ClassPathResource("./yumatch.json").getInputStream()))
                    .build();
            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
                log.info("Firebase app has been successfully initialized");

            }

        } catch (IOException e) {
            log.error("Firebase app could not be initialized, this is the error: {}", e.getMessage());
        }
    }

    /**
     * Helper method to send a notification to a single target via Firebase
     * 
     * @param notification the notification to be sent
     */
    public void sendNotificationToTarget(DirectNotification notification, @Nullable String key,
            @Nullable String value, @Nullable String type) {
        Message message = Message.builder()
                .setWebpushConfig(
                        WebpushConfig.builder()
                                .setNotification(
                                        WebpushNotification.builder()
                                                .setTitle(notification.getTitle())
                                                .setBody(notification.getMessage())
                                                .setIcon(notificationIcon)
                                                .build())
                                .putData(key, value)
                                .putData("type", type)

                                .build())

                .setToken(notification.getTarget())
                .build();

        FirebaseMessaging.getInstance().sendAsync(message);
    }

    /**
     * Helper method to send a notification to all users that have subscribed to
     * given topic via Firebase
     * 
     * @param notification the notification to be sent
     */
    public void sendNotificationToTopic(TopicNotification notification, @Nullable String key, @Nullable String value,
            @Nullable String type) {
        Message message = Message.builder()
                .setWebpushConfig(
                        WebpushConfig.builder()
                                .setNotification(
                                        WebpushNotification.builder()
                                                .setTitle(notification.getTitle())
                                                .setBody(notification.getMessage())
                                                .setIcon(notificationIcon)
                                                .build())
                                .putData(key, value)
                                .putData("type", type)

                                .build())
                .setTopic(notification.getTopic())
                .build();

        FirebaseMessaging.getInstance().sendAsync(message);

    }

    /**
     * Helper method to subscribe a given user to a given topic
     * 
     * @param subscriptionRequest
     */
    public void subscribeToTopic(SubscriptionRequest subscriptionRequest) {
        try {
            FirebaseMessaging.getInstance().subscribeToTopic(subscriptionRequest.getSubscriberIds(),
                    subscriptionRequest.getTopic());

        } catch (FirebaseMessagingException e) {
            log.error("Could not subscribe to topic, error message {}", e.getMessage());
        }
    }

    /**
     * Helper method to send a notification to multiple users
     * 
     * @param notifications the notifications being sent by Firebase
     */
    public void sendMultipleNotification(List<DirectNotification> notifications, @Nullable String key,
            @Nullable String value, @Nullable String type) {
        List<Message> messages = new ArrayList<Message>();
        notifications.forEach(notification -> {
            Message message = Message.builder()
                    .setWebpushConfig(
                            WebpushConfig.builder()
                                    .setNotification(
                                            WebpushNotification.builder()
                                                    .setTitle(notification.getTitle())
                                                    .setBody(notification.getMessage())
                                                    .setIcon(notificationIcon)
                                                    .build())
                                    .putData(key, value)
                                    .putData("type", type)

                                    .build())
                    .setToken(notification.getTarget())
                    .build();
            messages.add(message);
        });
        try {
            FirebaseMessaging.getInstance().sendAllAsync(messages);

        } catch (Exception e) {
            log.error("Error sending list of notifications, error message: {}", e.getMessage());
        }

    }

}
