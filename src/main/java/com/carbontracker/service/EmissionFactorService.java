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
                .orElseGet(() -> getDefaultFactor(category));
    }

    private Double getDefaultFactor(Activity.ActivityType category) {
        switch (category) {
            case TRAVEL: return 0.21;
            case ELECTRICITY: return 0.82;
            case FOOD: return 2.5;
            case HEATING: return 0.18;
            case FLIGHTS: return 0.15;
            case PRODUCT: return 1.0;
            case TREE_PLANTING: return 0.0;
            default: return 1.0;
        }
    }
}
