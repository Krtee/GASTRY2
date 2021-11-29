package io.yumatch.userservice.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import io.yumatch.userservice.constants.UserRole;
import io.yumatch.userservice.model.UserDto;

public interface UserRepository extends MongoRepository<UserDto, String> {

    public Optional<UserDto> findByUsername(String username);

    public Optional<UserDto> findByEmail(String email);

    public List<UserDto> findAllByRole(UserRole role);

    @Query(value = "{ 'id' : { $exists : true } }", fields = "{'id':1, 'active':1, 'role':1, 'username':1, 'firstname':1, 'lastname':1}")
    public List<UserDto> loadAllSimpleUser();

}
