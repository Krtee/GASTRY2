package io.foodtinder.dataservice.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import io.foodtinder.dataservice.model.MultiUserMatch;

public interface MultiUserMatchRepository extends MongoRepository<MultiUserMatch, String> {

    List<MultiUserMatch> findByMatches(String matchId);
}
