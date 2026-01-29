package com.carbontracker.dto;

public class DashboardStatsDTO {
    private Double todayEmissions;
    private Double totalEmissions;
    private Double monthlyChange;
    private Integer userRank;
    private Integer treesNeeded;
    private Integer treesPlanted;
    private Double totalPositiveEmissions;
    private Double communityAverage;

    public DashboardStatsDTO() {}

    public DashboardStatsDTO(Double todayEmissions, Double totalEmissions, Double monthlyChange, Integer userRank, Integer treesNeeded, Integer treesPlanted, Double totalPositiveEmissions, Double communityAverage) {
        this.todayEmissions = todayEmissions;
        this.totalEmissions = totalEmissions;
        this.monthlyChange = monthlyChange;
        this.userRank = userRank;
        this.treesNeeded = treesNeeded;
        this.treesPlanted = treesPlanted;
        this.totalPositiveEmissions = totalPositiveEmissions;
        this.communityAverage = communityAverage;
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
}
