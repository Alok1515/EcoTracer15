package com.carbontracker.service;

import com.carbontracker.model.Activity;
import com.carbontracker.model.EmissionFactor;
import com.carbontracker.repository.EmissionFactorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmissionFactorService {

    @Autowired
    private EmissionFactorRepository emissionFactorRepository;

    public Double getEmissionFactor(Activity.ActivityType category) {
        return emissionFactorRepository.findByCategory(category)
                .map(EmissionFactor::getCo2PerUnit)
                .orElseThrow(() -> new RuntimeException("Emission factor not found for category: " + category));
    }
}
