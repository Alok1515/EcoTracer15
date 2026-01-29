package com.carbontracker.repository;

import com.carbontracker.model.LcaFactor;
import com.carbontracker.model.LcaStage;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface LcaRepository extends MongoRepository<LcaFactor, String> {
    Optional<LcaFactor> findByStageAndName(LcaStage stage, String name);
}
