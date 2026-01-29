package com.carbontracker.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "lca_factors")
public class LcaFactor {
    @Id
    private String id;
    private LcaStage stage;
    private String name; // e.g., "COTTON", "PLASTIC", "TRUCK", "RECYCLE"
    private Double value; // emission factor
}
