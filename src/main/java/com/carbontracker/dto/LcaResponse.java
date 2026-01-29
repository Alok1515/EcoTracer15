package com.carbontracker.dto;

import java.util.Map;

public class LcaResponse {
    private Double totalEmission;
    private String unit;
    private Map<String, Double> breakdown;

    public LcaResponse() {}

    public LcaResponse(Double totalEmission, String unit, Map<String, Double> breakdown) {
        this.totalEmission = totalEmission;
        this.unit = unit;
        this.breakdown = breakdown;
    }

    public static LcaResponseBuilder builder() {
        return new LcaResponseBuilder();
    }

    public Double getTotalEmission() { return totalEmission; }
    public void setTotalEmission(Double totalEmission) { this.totalEmission = totalEmission; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public Map<String, Double> getBreakdown() { return breakdown; }
    public void setBreakdown(Map<String, Double> breakdown) { this.breakdown = breakdown; }

    public static class LcaResponseBuilder {
        private Double totalEmission;
        private String unit;
        private Map<String, Double> breakdown;

        public LcaResponseBuilder totalEmission(Double totalEmission) {
            this.totalEmission = totalEmission;
            return this;
        }

        public LcaResponseBuilder unit(String unit) {
            this.unit = unit;
            return this;
        }

        public LcaResponseBuilder breakdown(Map<String, Double> breakdown) {
            this.breakdown = breakdown;
            return this;
        }

        public LcaResponse build() {
            return new LcaResponse(totalEmission, unit, breakdown);
        }
    }
}
