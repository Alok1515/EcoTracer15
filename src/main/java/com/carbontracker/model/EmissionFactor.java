package com.carbontracker.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "emission_factors")
public class EmissionFactor {
    @Id
    private String id;
    private Activity.ActivityType category;
    private Double co2PerUnit;
}
