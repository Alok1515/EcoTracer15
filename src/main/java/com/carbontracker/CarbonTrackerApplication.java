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
            for (Activity.ActivityType type : Activity.ActivityType.values()) {
                if (!repository.findByCategory(type).isPresent()) {
                    double factor = switch (type) {
                        case TRAVEL -> 0.21;
                        case ELECTRICITY -> 0.82;
                        case FOOD -> 0.50;
                        case HEATING -> 0.18;
                        case FLIGHTS -> 0.15;
                        case PRODUCT -> 1.0;
                        case TREE_PLANTING -> -21.0;
                    };
                    repository.save(EmissionFactor.builder()
                            .category(type)
                            .co2PerUnit(factor)
                            .build());
                }
            }
        };
    }
}
