package com.carbontracker.repository;

import com.carbontracker.model.Activity;
import com.carbontracker.model.EmissionFactor;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface EmissionFactorRepository extends MongoRepository<EmissionFactor, String> {
    Optional<EmissionFactor> findByCategory(Activity.ActivityType category);
}
