package com.carbontracker.config;

import com.carbontracker.model.Activity;
import com.carbontracker.model.EmissionFactor;
import com.carbontracker.repository.EmissionFactorRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(EmissionFactorRepository repository) {
        return args -> {
            // Seed all emission factor types if they don't exist
            seedIfMissing(repository, Activity.ActivityType.TRAVEL, 0.21);
            seedIfMissing(repository, Activity.ActivityType.ELECTRICITY, 0.82);
            seedIfMissing(repository, Activity.ActivityType.FOOD, 2.5);
            seedIfMissing(repository, Activity.ActivityType.HEATING, 0.18);
            seedIfMissing(repository, Activity.ActivityType.FLIGHTS, 0.15);
            seedIfMissing(repository, Activity.ActivityType.PRODUCT, 1.0);
        };
    }

    private void seedIfMissing(EmissionFactorRepository repository, Activity.ActivityType type, double value) {
        if (repository.findByCategory(type).isEmpty()) {
            repository.save(new EmissionFactor(null, type, value));
        }
    }
}
