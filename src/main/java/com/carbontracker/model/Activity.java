package com.carbontracker.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "activities")
public class Activity {
    @Id
    private String id;
    private String userId;
    private ActivityType type;
    private Double value;
    private Double emission;
    private LocalDateTime date;

    public Activity() {}

    public Activity(String id, String userId, ActivityType type, Double value, Double emission, LocalDateTime date) {
        this.id = id;
        this.userId = userId;
        this.type = type;
        this.value = value;
        this.emission = emission;
        this.date = date;
    }

    public static ActivityBuilder builder() {
        return new ActivityBuilder();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public ActivityType getType() { return type; }
    public void setType(ActivityType type) { this.type = type; }
    public Double getValue() { return value; }
    public void setValue(Double value) { this.value = value; }
    public Double getEmission() { return emission; }
    public void setEmission(Double emission) { this.emission = emission; }
    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }

    public enum ActivityType {
        TRAVEL, ELECTRICITY, FOOD
    }

    public static class ActivityBuilder {
        private String id;
        private String userId;
        private ActivityType type;
        private Double value;
        private Double emission;
        private LocalDateTime date;

        public ActivityBuilder id(String id) { this.id = id; return this; }
        public ActivityBuilder userId(String userId) { this.userId = userId; return this; }
        public ActivityBuilder type(ActivityType type) { this.type = type; return this; }
        public ActivityBuilder value(Double value) { this.value = value; return this; }
        public ActivityBuilder emission(Double emission) { this.emission = emission; return this; }
        public ActivityBuilder date(LocalDateTime date) { this.date = date; return this; }

        public Activity build() {
            return new Activity(id, userId, type, value, emission, date);
        }
    }
}
