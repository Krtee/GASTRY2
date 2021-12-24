package io.yumatch.userservice.model;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Set;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;

import io.yumatch.userservice.constants.Preferences;
import io.yumatch.userservice.constants.UserRole;
import lombok.Data;

@Data
public class UserDto implements Serializable {

    @Id
    private String id;
    private LocalDateTime createDate;
    private LocalDateTime lastUpdated;
    private String firstName;
    private String lastName;
    private String username;
    private String email;
    private boolean active = true;
    private UserRole role;
    @Transient
    private String password;
    private String city = "";
    private HashMap<Preferences, Boolean> preferences = new HashMap<Preferences, Boolean>();
    private Set<String> favoriteRestaurantIds;
    private Set<String> followerUserIds;
    private Set<String> followingUserIds;

    /**
     * Helper method to update this {@link User} instance
     * 
     * @param updatedUser The clientside updated instance
     */
    public void update(UserDto updatedUser) {
        this.role = updatedUser.getRole();
        this.active = updatedUser.isActive();
        this.username = updatedUser.getUsername();
        this.firstName = updatedUser.getFirstName();
        this.lastName = updatedUser.getLastName();
        this.email = updatedUser.getEmail();
        this.preferences = updatedUser.getPreferences();
        this.city = updatedUser.getCity();
        this.favoriteRestaurantIds = updatedUser.getFavoriteRestaurantIds();
        this.followerUserIds = updatedUser.getFollowerUserIds();
        this.followingUserIds = updatedUser.getFollowingUserIds();
    }
}
