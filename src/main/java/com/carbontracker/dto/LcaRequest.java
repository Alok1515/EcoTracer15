package com.carbontracker.dto;

public class LcaRequest {
    private String materialType; // COTTON, PLASTIC, STEEL
    private Double materialKg;
    private Double energyKwh;
    private Double distanceKm;
    private String transportMode; // TRUCK, SHIP, AIR
    private Double usageKwh;
    private String disposalType; // RECYCLE, LANDFILL, INCINERATION

    public LcaRequest() {}

    public LcaRequest(String materialType, Double materialKg, Double energyKwh, Double distanceKm, String transportMode, Double usageKwh, String disposalType) {
        this.materialType = materialType;
        this.materialKg = materialKg;
        this.energyKwh = energyKwh;
        this.distanceKm = distanceKm;
        this.transportMode = transportMode;
        this.usageKwh = usageKwh;
        this.disposalType = disposalType;
    }

    public String getMaterialType() { return materialType; }
    public void setMaterialType(String materialType) { this.materialType = materialType; }

    public Double getMaterialKg() { return materialKg; }
    public void setMaterialKg(Double materialKg) { this.materialKg = materialKg; }

    public Double getEnergyKwh() { return energyKwh; }
    public void setEnergyKwh(Double energyKwh) { this.energyKwh = energyKwh; }

    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }

    public String getTransportMode() { return transportMode; }
    public void setTransportMode(String transportMode) { this.transportMode = transportMode; }

    public Double getUsageKwh() { return usageKwh; }
    public void setUsageKwh(Double usageKwh) { this.usageKwh = usageKwh; }

    public String getDisposalType() { return disposalType; }
    public void setDisposalType(String disposalType) { this.disposalType = disposalType; }
}
