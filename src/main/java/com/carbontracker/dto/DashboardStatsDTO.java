package com.carbontracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private Double todayEmissions;
    private Double totalEmissions;
    private Double monthlyChange;
    private Integer userRank;
    private Integer treesNeeded;
    private Double communityAverage;
}
