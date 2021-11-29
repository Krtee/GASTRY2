package io.yumatch.userservice.utils;

import java.time.LocalDateTime;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;

import io.yumatch.userservice.YumatchConfig;
import io.yumatch.userservice.constants.UserRole;
import io.yumatch.userservice.model.UserDto;
import io.yumatch.userservice.repositories.UserRepository;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class UserUtil {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private YumatchConfig config;

    @Autowired
    private KeyCloakService keycloakUtil;

    /**
     * The init method checks if the database has a super admin already and creates
     * one in case
     */
    @PostConstruct
    public void init() {
        UserDto adminUser = userRepo.findByEmail(config.getAdminMail()).orElse(null);
        if (adminUser == null) {
            log.info("Admin user was not created yet!");
            adminUser = new UserDto();
            adminUser.setCreateDate(LocalDateTime.now());
            adminUser.setRole(UserRole.ADMIN);
            adminUser.setUsername("super-admin");
            adminUser.setFirstName("Admin");
            adminUser.setLastName("User");
            adminUser.setEmail(config.getAdminMail());
            String password = keycloakUtil.generateRandomPassword();
            adminUser.setPassword(password);
            int responseStatus = keycloakUtil.createNewUser(adminUser);
            adminUser = userRepo.save(adminUser);
            if (responseStatus == 201) {
                log.info(
                        "===========================================================================================================");
                log.info("=== SUPER ADMIN USER WAS CREATED WITH MAIL {} AND PASSWORD {} === CHANGE YOUR PASSWORD NOW!",
                        config.getAdminMail(), password);
                log.info(
                        "===========================================================================================================");
            } else {
                userRepo.delete(adminUser);
                log.error("Admin user could not be created on keycloak!");
            }
        }
    }
}
