package io.yumatch.userservice.utils;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.ws.rs.core.Response;

import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.yumatch.userservice.YumatchConfig;
import io.yumatch.userservice.model.UserDto;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class KeyCloakService {

    private Keycloak keycloakInstance;

    @Autowired
    private YumatchConfig config;

    @PostConstruct
    public void init() {
        log.info("Initializing keycloak instance!");
        keycloakInstance = Keycloak.getInstance(config.getKeycloak().getUrl(), config.getKeycloak().getRealm(),
                config.getKeycloak().getAdminUser(), config.getKeycloak().getAdminPassword(), "admin-cli");

        log.info("Keycloak instance, {}", keycloakInstance);
    }

    /**
     * Helper to create a new user on keycloak
     * 
     * @param newUser
     * @return true if a new user is created otherwise false
     */
    public int createNewUser(UserDto newUser) {
        log.info("Creating new user on keycloak!");
        RealmResource realmResource = keycloakInstance.realm(config.getKeycloak().getRealm());
        UsersResource userResource = realmResource.users();
        // String newPassword = generateRandomPassword();
        Response response = userResource.create(createNewKeycloakUser(newUser, newUser.getPassword()));
        if (response.getStatus() == 201) {
            log.info("New user successfully created on keycloak!");
            String userId = response.getLocation().getPath().replaceAll(".*/([^/]+)$", "$1");

            UserResource userResources = userResource.get(userId);
            log.info("getting userRoles for Role {}", newUser.getRole().toString());
            RoleRepresentation userRealmRole = keycloakInstance.realm(config.getKeycloak().getRealm()).roles()
                    .get(newUser.getRole().toString()).toRepresentation();

            userResources.roles().realmLevel().add(List.of(userRealmRole));
            // TODO should an email be sent?
            return response.getStatus();
        } else {
            log.warn("User could not be created on keycloak! Status: {}", response.getStatus());
            log.warn("User could not be created on keycloak! Status: {}", response.readEntity(String.class));
            return response.getStatus();
        }
    }

    /**
     * Creates the new keycloak user based upon the given user register data.
     * 
     * @param newUser
     * @return The keycloak needed user representation
     */
    private UserRepresentation createNewKeycloakUser(UserDto newUser, String newPassword) {
        UserRepresentation userRepresentation = new UserRepresentation();
        Map<String, List<String>> serviceIdMap = new HashMap<String, List<String>>();
        serviceIdMap.put("serviceId", Arrays.asList(newUser.getId()));

        // general information
        userRepresentation.setEmail(newUser.getEmail());
        userRepresentation.setFirstName(newUser.getFirstName());
        userRepresentation.setLastName(newUser.getLastName());
        userRepresentation.setAttributes(serviceIdMap);
        userRepresentation.setEmailVerified(false);
        userRepresentation.setEnabled(true);
        userRepresentation.setCredentials(Arrays.asList(createUserCredentials(newPassword)));
        userRepresentation.setUsername(newUser.getUsername());
        return userRepresentation;
    }

    /**
     * Helper method to generate the user credentials needed by keycloak
     * 
     * @param password The password to use
     * @return The credentials based upon the given password
     */
    private CredentialRepresentation createUserCredentials(String password) {
        CredentialRepresentation newCredentials = new CredentialRepresentation();
        newCredentials.setType(CredentialRepresentation.PASSWORD);
        newCredentials.setValue(password);
        newCredentials.setTemporary(true);
        return newCredentials;
    }

    /**
     * Toggle the Enabled State in keycloak for a specific user
     * 
     * @param loadedUser
     * @return true if update was successfull, false otherwise
     */
    public boolean toggleEnabledStateInKeycloak(UserDto loadedUser) {
        RealmResource realmResource = keycloakInstance.realm(config.getKeycloak().getRealm());
        log.info("toggling user state {} on keycloak...", loadedUser.getId());

        UsersResource usersResource = realmResource.users();
        List<UserRepresentation> queryResult = usersResource.search(loadedUser.getUsername(), loadedUser.getFirstName(),
                loadedUser.getLastName(), loadedUser.getEmail(), null, null);
        if (queryResult == null || queryResult.isEmpty()) {
            log.warn("User with id {} was not found for update!", loadedUser.getId());
            return false;
        }
        UserResource userResource = usersResource.get(queryResult.get(0).getId());
        UserRepresentation userRepresentation = userResource.toRepresentation();
        userRepresentation.setEnabled(loadedUser.isActive());
        userResource.update(userRepresentation);
        return true;
    }

    /**
     * This updates all fields of the userobject.
     * 
     * @param updateUser The client side updated user
     * @param loadedUser The loaded db user
     * @return true if update was successfull, false otherwise
     */
    public boolean updateKeycloakUser(UserDto updateUser, UserDto loadedUser) {
        RealmResource realmResource = keycloakInstance.realm(config.getKeycloak().getRealm());
        log.info("Updating user {} on keycloak", updateUser.getId());

        UsersResource usersResource = realmResource.users();
        List<UserRepresentation> queryResult = usersResource.search(loadedUser.getUsername(), loadedUser.getFirstName(),
                loadedUser.getLastName(), loadedUser.getEmail(), null, null);
        if (queryResult == null || queryResult.isEmpty()) {
            log.warn("User with id {} was not found for update!", loadedUser.getId());
            return false;
        }
        UserResource userResource = usersResource.get(queryResult.get(0).getId());
        UserRepresentation userRepresentation = userResource.toRepresentation();

        userRepresentation.setFirstName(updateUser.getFirstName());
        userRepresentation.setLastName(updateUser.getLastName());
        userRepresentation.setEmail(updateUser.getEmail());
        userRepresentation.setUsername(updateUser.getUsername());
        userRepresentation.setEnabled(updateUser.isActive());

        userResource.roles().realmLevel().remove(userResource.roles().realmLevel().listAll());

        RoleRepresentation userRealmRole = keycloakInstance.realm(config.getKeycloak().getRealm()).roles()
                .get(updateUser.getRole().toString()).toRepresentation();
        userResource.roles().realmLevel().add(Arrays.asList(userRealmRole));

        // update user password if necessary
        if (updateUser.getPassword() != null
                && !(updateUser.getPassword().isEmpty() || updateUser.getPassword().isBlank())) {
            log.debug("Updating the user password!");
            userResource.resetPassword(createUserCredentials(updateUser.getPassword()));
        }
        // toggle the user active state if necessary
        if (loadedUser.isActive() != updateUser.isActive()) {
            log.debug("Change active state of user {}", loadedUser.getId());
            toggleEnabledStateInKeycloak(loadedUser);
        }
        userResource.update(userRepresentation);
        return true;
    }

    /**
     * Delete an {@link UserDTO} on keycloak
     * 
     * @param deleteUser The {@link UserDTO} object to delete
     * @return true if update was successfull, false otherwise
     */
    public boolean deleteUserOnKeycloak(UserDto deleteUser) {
        RealmResource realmResource = keycloakInstance.realm(config.getKeycloak().getRealm());
        log.info("Deleting user {} on keycloak", deleteUser.getId());
        UsersResource allUserResource = realmResource.users();
        List<UserRepresentation> queryResult = allUserResource.search(deleteUser.getUsername(),
                deleteUser.getFirstName(), deleteUser.getLastName(), deleteUser.getEmail(), null, null);
        if (queryResult == null || queryResult.isEmpty()) {
            log.warn("User with id {} was not found to delete!", deleteUser.getId());
            return false;
        }
        allUserResource.delete(queryResult.get(0).getId());
        return true;
    }
}
