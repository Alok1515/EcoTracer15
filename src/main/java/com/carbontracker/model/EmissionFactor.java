package com.carbontracker.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "emission_factors")
public class EmissionFactor {
    @Id
    private String id;
    private Activity.ActivityType category;
    private Double co2PerUnit;

    public EmissionFactor() {}

    public EmissionFactor(String id, Activity.ActivityType category, Double co2PerUnit) {
        this.id = id;
        this.category = category;
        this.co2PerUnit = co2PerUnit;
    }

    public static EmissionFactorBuilder builder() {
        return new EmissionFactorBuilder();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public Activity.ActivityType getCategory() { return category; }
    public void setCategory(Activity.ActivityType category) { this.category = category; }
    public Double getCo2PerUnit() { return co2PerUnit; }
    public void setCo2PerUnit(Double co2PerUnit) { this.co2PerUnit = co2PerUnit; }

    public static class EmissionFactorBuilder {
        private String id;
        private Activity.ActivityType category;
        private Double co2PerUnit;

        public EmissionFactorBuilder id(String id) { this.id = id; return this; }
        public EmissionFactorBuilder category(Activity.ActivityType category) { this.category = category; return this; }
        public EmissionFactorBuilder co2PerUnit(Double co2PerUnit) { this.co2PerUnit = co2PerUnit; return this; }
        public EmissionFactor build() {
            return new EmissionFactor(id, category, co2PerUnit);
        }
    }
}
