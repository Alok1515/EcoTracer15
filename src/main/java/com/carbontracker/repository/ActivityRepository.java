package com.carbontracker.repository;

import com.carbontracker.model.Activity;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface ActivityRepository extends MongoRepository<Activity, String> {
    List<Activity> findByUserId(String userId);
    List<Activity> findByUserIdAndDateBetween(String userId, LocalDateTime start, LocalDateTime end);
    void deleteByUserId(String userId);
}
