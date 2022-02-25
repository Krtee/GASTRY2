package io.yumatch.userservice.utils;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.yumatch.userservice.model.UserDto;
import io.yumatch.userservice.repositories.UserRepository;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class BuddyUtil {
    @Autowired
    private UserRepository userRepo;

    public void deleteBuddyInAllUsers(String buddyId) {
        List<UserDto> loadedUsers = userRepo.findAll();
        UserDto buddyUser = userRepo.findById(buddyId).orElse(null);

        for (UserDto loadedUser : loadedUsers) {
            if (buddyUser == null) {
                log.warn("Buddy user with id is missing {}!", buddyId);
                loadedUser.removeBuddy(buddyId);
                userRepo.save(loadedUser);
            }
            if (buddyUser.removeBuddy(loadedUser.getId())) {
                userRepo.save(loadedUser);
            }
        }

    }
}
