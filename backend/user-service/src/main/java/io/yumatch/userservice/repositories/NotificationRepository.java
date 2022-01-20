package io.yumatch.userservice.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import io.yumatch.userservice.constants.NotificationType;
import io.yumatch.userservice.model.PersistedNotification;

public interface NotificationRepository extends MongoRepository<PersistedNotification, String> {

    List<PersistedNotification> findByUserId(String userId);

    @Query(value = "{ 'seen': ?0 }")
    List<PersistedNotification> findBySeen(boolean seen);

    @Query(value = "{ 'userId': ?0, 'notificationType': ?1 }")
    List<PersistedNotification> findByUserIdAndType(String userId, NotificationType notificationType);

    @Query(value = "{ 'userId': ?0, 'seen': ?1 }")
    List<PersistedNotification> findByUserIdAndSeen(String userId, boolean seen);

}
