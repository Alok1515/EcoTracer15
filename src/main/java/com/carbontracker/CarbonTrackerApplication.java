package com.carbontracker;

import com.carbontracker.model.Activity;
import com.carbontracker.model.EmissionFactor;
import com.carbontracker.repository.EmissionFactorRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class CarbonTrackerApplication {

    public static void main(String[] args) {
        SpringApplication.run(CarbonTrackerApplication.class, args);
    }

    @Bean
    public CommandLineRunner seedData(EmissionFactorRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                repository.save(EmissionFactor.builder()
                        .category(Activity.ActivityType.TRAVEL)
                        .co2PerUnit(0.21)
                        .build());
                repository.save(EmissionFactor.builder()
                        .category(Activity.ActivityType.ELECTRICITY)
                        .co2PerUnit(0.82)
                        .build());
                repository.save(EmissionFactor.builder()
                        .category(Activity.ActivityType.FOOD)
                        .co2PerUnit(0.50) // Example factor for Food
                        .build());
            }
        };
    }
}
