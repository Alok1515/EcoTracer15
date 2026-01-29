package com.carbontracker.dto;

public class LeaderboardDTO {
    private String name;
    private Double netEmission;
    private int rank;
    private int streakCount;
    private int treesPlanted;

    public LeaderboardDTO() {}

    public LeaderboardDTO(String name, Double netEmission, int rank, int streakCount, int treesPlanted) {
        this.name = name;
        this.netEmission = netEmission;
        this.rank = rank;
        this.streakCount = streakCount;
        this.treesPlanted = treesPlanted;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Double getNetEmission() { return netEmission; }
    public void setNetEmission(Double netEmission) { this.netEmission = netEmission; }
    public int getRank() { return rank; }
    public void setRank(int rank) { this.rank = rank; }
    public int getStreakCount() { return streakCount; }
    public void setStreakCount(int streakCount) { this.streakCount = streakCount; }
    public int getTreesPlanted() { return treesPlanted; }
    public void setTreesPlanted(int treesPlanted) { this.treesPlanted = treesPlanted; }

    public static LeaderboardDTOBuilder builder() {
        return new LeaderboardDTOBuilder();
    }

    public static class LeaderboardDTOBuilder {
        private String name;
        private Double netEmission;
        private int rank;
        private int streakCount;
        private int treesPlanted;

        public LeaderboardDTOBuilder name(String name) { this.name = name; return this; }
        public LeaderboardDTOBuilder netEmission(Double netEmission) { this.netEmission = netEmission; return this; }
        public LeaderboardDTOBuilder rank(int rank) { this.rank = rank; return this; }
        public LeaderboardDTOBuilder streakCount(int streakCount) { this.streakCount = streakCount; return this; }
        public LeaderboardDTOBuilder treesPlanted(int treesPlanted) { this.treesPlanted = treesPlanted; return this; }
        public LeaderboardDTO build() {
            return new LeaderboardDTO(name, netEmission, rank, streakCount, treesPlanted);
        }
    }
}
