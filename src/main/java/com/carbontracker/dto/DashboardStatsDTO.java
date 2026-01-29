package com.carbontracker.dto;

import java.util.List;
import java.util.Map;

public class DashboardStatsDTO {
    private Double todayEmissions;
    private Double totalEmissions;
    private Double monthlyChange;
    private Integer userRank;
    private Integer treesNeeded;
    private Integer treesPlanted;
    private Double totalPositiveEmissions;
    private Double communityAverage;
    private Double netBalance;
    private Integer streakCount;
    private Double topPerformerEmissions;
    private Map<String, Double> categoryEmissions;
    private List<Map<String, Object>> timelineData;

    public DashboardStatsDTO() {}

    public DashboardStatsDTO(Double todayEmissions, Double totalEmissions, Double monthlyChange, Integer userRank, Integer treesNeeded, Integer treesPlanted, Double totalPositiveEmissions, Double communityAverage, Double netBalance, Integer streakCount, Double topPerformerEmissions, Map<String, Double> categoryEmissions, List<Map<String, Object>> timelineData) {
        this.todayEmissions = todayEmissions;
        this.totalEmissions = totalEmissions;
        this.monthlyChange = monthlyChange;
        this.userRank = userRank;
        this.treesNeeded = treesNeeded;
        this.treesPlanted = treesPlanted;
        this.totalPositiveEmissions = totalPositiveEmissions;
        this.communityAverage = communityAverage;
        this.netBalance = netBalance;
        this.streakCount = streakCount;
        this.topPerformerEmissions = topPerformerEmissions;
        this.categoryEmissions = categoryEmissions;
        this.timelineData = timelineData;
    }

    public Double getTodayEmissions() { return todayEmissions; }
    public void setTodayEmissions(Double todayEmissions) { this.todayEmissions = todayEmissions; }
    public Double getTotalEmissions() { return totalEmissions; }
    public void setTotalEmissions(Double totalEmissions) { this.totalEmissions = totalEmissions; }
    public Double getMonthlyChange() { return monthlyChange; }
    public void setMonthlyChange(Double monthlyChange) { this.monthlyChange = monthlyChange; }
    public Integer getUserRank() { return userRank; }
    public void setUserRank(Integer userRank) { this.userRank = userRank; }
    public Integer getTreesNeeded() { return treesNeeded; }
    public void setTreesNeeded(Integer treesNeeded) { this.treesNeeded = treesNeeded; }
    public Integer getTreesPlanted() { return treesPlanted; }
    public void setTreesPlanted(Integer treesPlanted) { this.treesPlanted = treesPlanted; }
    public Double getTotalPositiveEmissions() { return totalPositiveEmissions; }
    public void setTotalPositiveEmissions(Double totalPositiveEmissions) { this.totalPositiveEmissions = totalPositiveEmissions; }
    public Double getCommunityAverage() { return communityAverage; }
    public void setCommunityAverage(Double communityAverage) { this.communityAverage = communityAverage; }
    public Double getNetBalance() { return netBalance; }
    public void setNetBalance(Double netBalance) { this.netBalance = netBalance; }
    public Integer getStreakCount() { return streakCount; }
    public void setStreakCount(Integer streakCount) { this.streakCount = streakCount; }
    public Double getTopPerformerEmissions() { return topPerformerEmissions; }
    public void setTopPerformerEmissions(Double topPerformerEmissions) { this.topPerformerEmissions = topPerformerEmissions; }
    public Map<String, Double> getCategoryEmissions() { return categoryEmissions; }
    public void setCategoryEmissions(Map<String, Double> categoryEmissions) { this.categoryEmissions = categoryEmissions; }
    public List<Map<String, Object>> getTimelineData() { return timelineData; }
    public void setTimelineData(List<Map<String, Object>> timelineData) { this.timelineData = timelineData; }
}
