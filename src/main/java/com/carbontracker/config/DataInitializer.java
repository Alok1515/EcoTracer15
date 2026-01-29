package com.carbontracker.config;

import com.carbontracker.model.Activity;
import com.carbontracker.model.EmissionFactor;
import com.carbontracker.model.LcaFactor;
import com.carbontracker.model.LcaStage;
import com.carbontracker.repository.EmissionFactorRepository;
import com.carbontracker.repository.LcaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(EmissionFactorRepository repository, LcaRepository lcaRepository) {
        return args -> {
            // Seed all emission factor types if they don't exist
            seedIfMissing(repository, Activity.ActivityType.TRAVEL, 0.21);
            seedIfMissing(repository, Activity.ActivityType.ELECTRICITY, 0.82);
            seedIfMissing(repository, Activity.ActivityType.FOOD, 2.5);
            seedIfMissing(repository, Activity.ActivityType.HEATING, 0.18);
            seedIfMissing(repository, Activity.ActivityType.FLIGHTS, 0.15);
            seedIfMissing(repository, Activity.ActivityType.PRODUCT, 1.0);

            // Seed LCA Factors
            seedLcaIfMissing(lcaRepository, LcaStage.RAW_MATERIAL, "COTTON", 5.9);
            seedLcaIfMissing(lcaRepository, LcaStage.RAW_MATERIAL, "PLASTIC", 2.5);
            seedLcaIfMissing(lcaRepository, LcaStage.RAW_MATERIAL, "STEEL", 1.9);
            
            seedLcaIfMissing(lcaRepository, LcaStage.MANUFACTURING, "ELECTRICITY", 0.82);
            
            seedLcaIfMissing(lcaRepository, LcaStage.TRANSPORTATION, "TRUCK", 0.12);
            seedLcaIfMissing(lcaRepository, LcaStage.TRANSPORTATION, "SHIP", 0.015);
            seedLcaIfMissing(lcaRepository, LcaStage.TRANSPORTATION, "AIR", 0.60);
            
            seedLcaIfMissing(lcaRepository, LcaStage.END_OF_LIFE, "RECYCLE", 0.5);
            seedLcaIfMissing(lcaRepository, LcaStage.END_OF_LIFE, "LANDFILL", 1.9);
            seedLcaIfMissing(lcaRepository, LcaStage.END_OF_LIFE, "INCINERATION", 3.2);
        };
    }

    private void seedIfMissing(EmissionFactorRepository repository, Activity.ActivityType type, double value) {
        if (repository.findByCategory(type).isEmpty()) {
            repository.save(new EmissionFactor(null, type, value));
        }
    }

    private void seedLcaIfMissing(LcaRepository repository, LcaStage stage, String name, double value) {
        if (repository.findByStageAndName(stage, name).isEmpty()) {
            repository.save(LcaFactor.builder()
                    .stage(stage)
                    .name(name)
                    .value(value)
                    .build());
        }
    }
}
