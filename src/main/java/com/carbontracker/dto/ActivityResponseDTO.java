package com.carbontracker.dto;

import com.carbontracker.model.Activity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityResponseDTO {
    private Activity activity;
    private boolean isFirstToday;
    private int streakCount;
}
