package io.foodtinder.dataservice.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import io.foodtinder.dataservice.model.Match;

public interface MatchRepository extends MongoRepository<Match, String> {

    public Optional<Match> getMatchById(String id);

    public Optional<List<Match>> findAllByUserId(String userId);

}
