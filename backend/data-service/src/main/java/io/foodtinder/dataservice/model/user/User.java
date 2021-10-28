package io.foodtinder.dataservice.model.user;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;

import io.foodtinder.dataservice.constants.Gender;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

@Data
@Slf4j
/**
 * Just demo file
 */
public class User {

      // technical fields
      @Id
      private String id;
      private LocalDateTime createDate;
      private String createdBy;

      private String name;
      private Gender gender;


      public void update(User updateUser) {
          log.debug("User is being updated");
          this.name = updateUser.getName();
          this.gender = updateUser.getGender();
      }
    
}
