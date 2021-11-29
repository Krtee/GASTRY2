package io.yumatch.userservice.model;

import java.io.Serializable;
import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;

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
    }
}
