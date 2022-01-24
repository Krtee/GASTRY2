package io.yumatch.userservice.model;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Set;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;

import io.yumatch.userservice.constants.Diets;
import io.yumatch.userservice.constants.Intolerances;
import io.yumatch.userservice.constants.BuddyType;
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
    private String token;
    private List<Buddy> buddies = new ArrayList<Buddy>();

    @Transient
    private String password;
    private String city = "";
    private String latitude = "";
    private String longitude = "";
    private String bio = "";
    private Diets diets;
    private Intolerances intolerances;
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
        this.token = updatedUser.getToken();
        this.city = updatedUser.getCity();
        this.latitude = updatedUser.getLatitude();
        this.longitude = updatedUser.getLongitude();
        this.bio = updatedUser.getBio();
        this.diets = updatedUser.getDiets();
        this.intolerances = updatedUser.getIntolerances();
        this.favoriteRestaurantIds = updatedUser.getFavoriteRestaurantIds();
        this.followerUserIds = updatedUser.getFollowerUserIds();
        this.followingUserIds = updatedUser.getFollowingUserIds();
    }

    /**
     * Helper method to add new {@link Buddy} instance to {@link User}
     * 
     * @param buddyId    to id of the buddy to be added
     * @param buddyState the BuddyType the new instance of {@link Buddy} should
     *                   contain
     * @return the new {@link Buddy} instance
     */
    public Buddy addBuddy(String buddyId, BuddyType buddyState) {
        Buddy newBuddy = new Buddy();
        newBuddy.setCreateDate(LocalDateTime.now());
        newBuddy.setBuddyId(buddyId);
        newBuddy.setBuddyType(buddyState);
        this.buddies.add(newBuddy);
        this.lastUpdated = LocalDateTime.now();
        return newBuddy;
    }

    /**
     * Helper method to remove {@link Buddy} from buddies list
     * 
     * @param buddyId the id of the buddy to be removed
     * @return true if successful otherwise false
     */
    public boolean removeBuddy(String buddyId) {
        this.lastUpdated = LocalDateTime.now();
        return this.buddies.removeIf(buddy -> buddy.getBuddyId().equals(buddyId));
    }

    /**
     * Helper method to update instance of {@link Buddy}
     * 
     * @param updatedBuddy to new updated instance of {@link Buddy}
     */
    public void updateBuddy(Buddy updatedBuddy) {
        this.lastUpdated = LocalDateTime.now();
        Buddy foundBuddy = getBuddyFromList(updatedBuddy.getBuddyId());
        if (foundBuddy == null) {
            return;
        }
        foundBuddy.update(updatedBuddy);
    }

    /**
     * Helper method to set a buddy instance to rejected
     * 
     * @param buddyId the id of the buddy to be rejected
     */
    public void rejectBuddy(String buddyId) {
        this.lastUpdated = LocalDateTime.now();
        Buddy foundBuddy = getBuddyFromList(buddyId);
        if (foundBuddy == null) {
            return;
        }
        foundBuddy.setBuddyType(BuddyType.REJECTED);
        foundBuddy.setLastUpdated(LocalDateTime.now());
    }

    /**
     * Helper method to set a buddy instance to accepted
     * 
     * @param buddyId the id of the buddy to be accepted
     */
    public void acceptBuddy(String buddyId) {
        this.lastUpdated = LocalDateTime.now();
        Buddy foundBuddy = getBuddyFromList(buddyId);
        if (foundBuddy == null) {
            return;
        }
        foundBuddy.setBuddyType(BuddyType.ACCEPTED);
        foundBuddy.setLastUpdated(LocalDateTime.now());
    }

    /**
     * Helper method to get a buddy from a given list of buddies
     * 
     * @param buddyList a list containing buddies
     * @param buddyId   the id of buddy to be found
     * @return a buddy instance if search successful otherwise null
     */
    public Buddy getBuddyFromList(String buddyId) {
        return this.buddies.stream().filter(buddy -> buddy.getBuddyId().equals(buddyId)).findFirst()
                .orElse(null);
    }
}
