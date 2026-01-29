package com.carbontracker.config;

import com.carbontracker.model.LcaFactor;
import com.carbontracker.model.LcaStage;
import com.carbontracker.repository.LcaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class LcaDataSeeder {

    @Bean
    CommandLineRunner seedLcaFactors(LcaRepository repository) {
        return args -> {
            if (repository.count() > 0) {
                return;
            }

            List<LcaFactor> factors = List.of(
                // Raw Material
                new LcaFactor(null, LcaStage.RAW_MATERIAL, "COTTON", 5.9),
                new LcaFactor(null, LcaStage.RAW_MATERIAL, "PLASTIC", 2.5),
                new LcaFactor(null, LcaStage.RAW_MATERIAL, "STEEL", 1.9),

                // Manufacturing
                new LcaFactor(null, LcaStage.MANUFACTURING, "ELECTRICITY", 0.82),

                // Transportation
                new LcaFactor(null, LcaStage.TRANSPORTATION, "TRUCK", 0.12),
                new LcaFactor(null, LcaStage.TRANSPORTATION, "SHIP", 0.015),
                new LcaFactor(null, LcaStage.TRANSPORTATION, "AIR", 0.60),

                // End of Life
                new LcaFactor(null, LcaStage.END_OF_LIFE, "RECYCLE", 0.5),
                new LcaFactor(null, LcaStage.END_OF_LIFE, "LANDFILL", 1.9),
                new LcaFactor(null, LcaStage.END_OF_LIFE, "INCINERATION", 3.2)
            );

            repository.saveAll(factors);
            System.out.println("LCA Emission Factors Seeded successfully!");
        };
    }
}
