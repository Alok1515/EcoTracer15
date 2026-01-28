package com.carbontracker.dto;

import com.carbontracker.model.Activity;

public class ActivityDTO {
    private Activity.ActivityType type;
    private Double value;

    public ActivityDTO() {}

    public ActivityDTO(Activity.ActivityType type, Double value) {
        this.type = type;
        this.value = value;
    }

    public static ActivityDTOBuilder builder() {
        return new ActivityDTOBuilder();
    }

    public Activity.ActivityType getType() { return type; }
    public void setType(Activity.ActivityType type) { this.type = type; }
    public Double getValue() { return value; }
    public void setValue(Double value) { this.value = value; }

    public static class ActivityDTOBuilder {
        private Activity.ActivityType type;
        private Double value;

        public ActivityDTOBuilder type(Activity.ActivityType type) { this.type = type; return this; }
        public ActivityDTOBuilder value(Double value) { this.value = value; return this; }
        public ActivityDTO build() {
            return new ActivityDTO(type, value);
        }
    }
}
