package io.foodtinder.dataservice.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import io.foodtinder.dataservice.model.GoogleRespSave;

public interface GoogleRepository extends MongoRepository<GoogleRespSave, String> {

    public List<GoogleRespSave> findByAreaAndCategoryAndTag(String area, String category, String tag);
}
