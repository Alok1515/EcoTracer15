package com.carbontracker.dto;

import com.carbontracker.model.Activity;

public class ActivityResponseDTO {
    private Activity activity;
    private boolean isFirstToday;
    private int streakCount;

    public ActivityResponseDTO() {}

    public ActivityResponseDTO(Activity activity, boolean isFirstToday, int streakCount) {
        this.activity = activity;
        this.isFirstToday = isFirstToday;
        this.streakCount = streakCount;
    }

    public static ActivityResponseDTOBuilder builder() {
        return new ActivityResponseDTOBuilder();
    }

    public Activity getActivity() { return activity; }
    public void setActivity(Activity activity) { this.activity = activity; }
    public boolean isFirstToday() { return isFirstToday; }
    public void setFirstToday(boolean firstToday) { isFirstToday = firstToday; }
    public int getStreakCount() { return streakCount; }
    public void setStreakCount(int streakCount) { this.streakCount = streakCount; }

    public static class ActivityResponseDTOBuilder {
        private Activity activity;
        private boolean isFirstToday;
        private int streakCount;

        public ActivityResponseDTOBuilder activity(Activity activity) {
            this.activity = activity;
            return this;
        }

        public ActivityResponseDTOBuilder isFirstToday(boolean isFirstToday) {
            this.isFirstToday = isFirstToday;
            return this;
        }

        public ActivityResponseDTOBuilder streakCount(int streakCount) {
            this.streakCount = streakCount;
            return this;
        }

        public ActivityResponseDTO build() {
            return new ActivityResponseDTO(activity, isFirstToday, streakCount);
        }
    }
}
