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
            // Emission factors are based on IPCC and UK DEFRA publicly available datasets.
            if (repository.count() == 0) {
                repository.saveAll(List.of(
                    new EmissionFactor(null, Activity.ActivityType.TRAVEL, 0.21),
                    new EmissionFactor(null, Activity.ActivityType.ELECTRICITY, 0.82),
                    new EmissionFactor(null, Activity.ActivityType.FOOD, 2.5),
                    new EmissionFactor(null, Activity.ActivityType.HEATING, 0.18),
                    new EmissionFactor(null, Activity.ActivityType.FLIGHTS, 0.15),
                    new EmissionFactor(null, Activity.ActivityType.PRODUCT, 50.0)
                ));
            }
        };
    }
}
