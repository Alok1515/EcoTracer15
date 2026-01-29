package com.carbontracker.service;

import com.carbontracker.dto.LcaRequest;
import com.carbontracker.dto.LcaResponse;
import com.carbontracker.model.LcaFactor;
import com.carbontracker.model.LcaStage;
import com.carbontracker.repository.LcaRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * Service for Product Life Cycle Assessment (LCA) calculations.
 * Emission factors are based on IPCC and UK DEFRA public datasets.
 */
@Service
public class LcaService {

    private final LcaRepository lcaRepository;

    public LcaService(LcaRepository lcaRepository) {
        this.lcaRepository = lcaRepository;
    }

    public LcaResponse calculateEmissions(LcaRequest request) {
        Map<String, Double> breakdown = new HashMap<>();
        
        // 1. Raw Material Emission
        // Formula: materialKg * emissionFactor(materialType)
        double rawMaterialFactor = getFactorValue(LcaStage.RAW_MATERIAL, request.getMaterialType());
        double rawMaterialEmission = request.getMaterialKg() * rawMaterialFactor;
        breakdown.put("rawMaterial", Math.round(rawMaterialEmission * 100.0) / 100.0);

        // 2. Manufacturing Emission
        // Formula: energyKwh * emissionFactor(ELECTRICITY)
        double electricityFactor = getFactorValue(LcaStage.MANUFACTURING, "ELECTRICITY");
        double manufacturingEmission = request.getEnergyKwh() * electricityFactor;
        breakdown.put("manufacturing", Math.round(manufacturingEmission * 100.0) / 100.0);

        // 3. Transportation Emission
        // Formula: (materialKg / 1000) * distanceKm * emissionFactor(transportMode)
        // Factors are in kg CO2 / ton-km, so we convert kg to tons
        double transportFactor = getFactorValue(LcaStage.TRANSPORTATION, request.getTransportMode());
        double transportEmission = (request.getMaterialKg() / 1000.0) * request.getDistanceKm() * transportFactor;
        breakdown.put("transport", Math.round(transportEmission * 100.0) / 100.0);

        // 4. Usage Emission
        // Formula: usageKwh * emissionFactor(ELECTRICITY)
        double usageEmission = request.getUsageKwh() * electricityFactor;
        breakdown.put("usage", Math.round(usageEmission * 100.0) / 100.0);

        // 5. End-of-Life (Disposal) Emission
        // Formula: materialKg * emissionFactor(disposalType)
        double disposalFactor = getFactorValue(LcaStage.END_OF_LIFE, request.getDisposalType());
        double disposalEmission = request.getMaterialKg() * disposalFactor;
        breakdown.put("disposal", Math.round(disposalEmission * 100.0) / 100.0);

        // Total Emission calculation
        double totalEmission = rawMaterialEmission + manufacturingEmission + transportEmission + usageEmission + disposalEmission;

        return LcaResponse.builder()
                .totalEmission(Math.round(totalEmission * 100.0) / 100.0)
                .unit("kg CO2")
                .breakdown(breakdown)
                .build();
    }

    private double getFactorValue(LcaStage stage, String name) {
        return lcaRepository.findByStageAndName(stage, name)
                .map(LcaFactor::getValue)
                .orElse(0.0);
    }
}
