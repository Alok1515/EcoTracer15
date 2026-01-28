package com.carbontracker.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "activities")
public class Activity {
    @Id
    private String id;
    private String userId;
    private ActivityType type;
    private Double value;
    private Double emission;
    private LocalDateTime date;

    public enum ActivityType {
        TRAVEL, ELECTRICITY, FOOD
    }
}
