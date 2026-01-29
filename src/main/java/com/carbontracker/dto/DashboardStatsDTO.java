package com.carbontracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class DashboardStatsDTO {
    private Double todayEmissions;
    private Double totalEmissions;
    private Double monthlyChange;
    private Integer userRank;
    private Integer treesNeeded;
    private Double communityAverage;

    public DashboardStatsDTO(Double todayEmissions, Double totalEmissions, Double monthlyChange, Integer userRank, Integer treesNeeded, Double communityAverage) {
        this.todayEmissions = todayEmissions;
        this.totalEmissions = totalEmissions;
        this.monthlyChange = monthlyChange;
        this.userRank = userRank;
        this.treesNeeded = treesNeeded;
        this.communityAverage = communityAverage;
    }
}
