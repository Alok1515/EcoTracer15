package com.carbontracker.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "lca_factors")
public class LcaFactor {
    @Id
    private String id;
    private LcaStage stage;
    private String name; // e.g., "COTTON", "PLASTIC", "TRUCK", "RECYCLE"
    private Double value; // emission factor

    public LcaFactor() {}

    public LcaFactor(String id, LcaStage stage, String name, Double value) {
        this.id = id;
        this.stage = stage;
        this.name = name;
        this.value = value;
    }

    public static LcaFactorBuilder builder() {
        return new LcaFactorBuilder();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public LcaStage getStage() { return stage; }
    public void setStage(LcaStage stage) { this.stage = stage; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Double getValue() { return value; }
    public void setValue(Double value) { this.value = value; }

    public static class LcaFactorBuilder {
        private String id;
        private LcaStage stage;
        private String name;
        private Double value;

        public LcaFactorBuilder id(String id) {
            this.id = id;
            return this;
        }

        public LcaFactorBuilder stage(LcaStage stage) {
            this.stage = stage;
            return this;
        }

        public LcaFactorBuilder name(String name) {
            this.name = name;
            return this;
        }

        public LcaFactorBuilder value(Double value) {
            this.value = value;
            return this;
        }

        public LcaFactor build() {
            return new LcaFactor(id, stage, name, value);
        }
    }
}
