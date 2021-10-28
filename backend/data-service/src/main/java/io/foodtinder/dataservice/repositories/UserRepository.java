package io.foodtinder.dataservice.repositories;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import io.foodtinder.dataservice.model.user.User;

public interface UserRepository extends MongoRepository<User,String> {
    
    public Optional<User> findByName(String name);
    
}
