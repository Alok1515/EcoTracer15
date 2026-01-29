package com.carbontracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LcaRequest {
    private String materialType; // COTTON, PLASTIC, STEEL
    private Double materialKg;
    private Double energyKwh;
    private Double distanceKm;
    private String transportMode; // TRUCK, SHIP, AIR
    private Double usageKwh;
    private String disposalType; // RECYCLE, LANDFILL, INCINERATION
}
