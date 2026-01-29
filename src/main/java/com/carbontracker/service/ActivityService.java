package com.carbontracker.service;

import com.carbontracker.dto.ActivityDTO;
import com.carbontracker.dto.ActivityResponseDTO;
import com.carbontracker.dto.DashboardStatsDTO;
import com.carbontracker.dto.LeaderboardDTO;
import com.carbontracker.model.Activity;
import com.carbontracker.model.User;
import com.carbontracker.repository.ActivityRepository;
import com.carbontracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ActivityService {

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmissionFactorService emissionFactorService;

    public ActivityResponseDTO addActivity(ActivityDTO dto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Emission factors are based on IPCC and UK DEFRA publicly available datasets.
        Double factor = emissionFactorService.getEmissionFactor(dto.getType());
        Double emission = dto.getValue() * factor;

        Activity activity = Activity.builder()
                .userId(user.getId())
                .type(dto.getType())
                .value(dto.getValue())
                .emission(emission)
                .description(dto.getDescription())
                .date(LocalDateTime.now())
                .build();

        boolean isFirstToday = user.getLastLogDate() == null || !user.getLastLogDate().equals(LocalDate.now());
        updateUserStreak(user);

        Activity savedActivity = activityRepository.save(activity);
        
        return ActivityResponseDTO.builder()
                .activity(savedActivity)
                .isFirstToday(isFirstToday)
                .streakCount(user.getStreakCount())
                .build();
    }

    private void updateUserStreak(User user) {
        LocalDate today = LocalDate.now();
        LocalDate lastLog = user.getLastLogDate();

        if (lastLog == null) {
            user.setStreakCount(1);
        } else if (lastLog.equals(today)) {
            // Already logged today, streak remains same
        } else if (lastLog.equals(today.minusDays(1))) {
            // Logged yesterday, increment streak
            user.setStreakCount(user.getStreakCount() + 1);
        } else {
            // Missed a day, reset streak
            user.setStreakCount(1);
        }

        user.setLastLogDate(today);
        userRepository.save(user);
    }

    public List<Activity> getUserActivities() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return activityRepository.findByUserId(user.getId());
    }

    public Double getTodayEmissions() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDateTime start = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
        LocalDateTime end = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);

        Double todayEmissions = activityRepository.findByUserIdAndDateBetween(user.getId(), start, end)
                .stream()
                .filter(a -> a.getEmission() != null)
                .mapToDouble(Activity::getEmission)
                .sum();
        return Math.max(0.0, todayEmissions);
    }

    public Double getMonthlyEmissions() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDateTime start = LocalDateTime.of(LocalDate.now().withDayOfMonth(1), LocalTime.MIN);
        LocalDateTime end = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);

        Double monthlyEmissions = activityRepository.findByUserIdAndDateBetween(user.getId(), start, end)
                .stream()
                .filter(a -> a.getEmission() != null)
                .mapToDouble(Activity::getEmission)
                .sum();
        return Math.max(0.0, monthlyEmissions);
    }

    public DashboardStatsDTO getDashboardStats() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfMonth = now.withDayOfMonth(1).with(LocalTime.MIN);
        LocalDateTime endOfMonth = now.with(LocalTime.MAX);
        
        List<Activity> allUserActivities = activityRepository.findByUserId(user.getId());

        // Current Month Emissions for current user
        Double monthlyEmissions = allUserActivities.stream()
                .filter(a -> a.getDate() != null && a.getDate().isAfter(startOfMonth) && a.getDate().isBefore(endOfMonth))
                .filter(a -> a.getEmission() != null)
                .mapToDouble(Activity::getEmission)
                .sum();
        monthlyEmissions = Math.max(0.0, monthlyEmissions);

        // Previous Month Emissions for current user
        LocalDateTime startOfLastMonth = startOfMonth.minusMonths(1);
        LocalDateTime endOfLastMonth = startOfMonth.minusSeconds(1);
        Double lastMonthEmissions = allUserActivities.stream()
                .filter(a -> a.getDate() != null && a.getDate().isAfter(startOfLastMonth) && a.getDate().isBefore(endOfLastMonth))
                .filter(a -> a.getEmission() != null)
                .mapToDouble(Activity::getEmission)
                .sum();
        lastMonthEmissions = Math.max(0.0, lastMonthEmissions);

        Double monthlyChange = 0.0;
        if (lastMonthEmissions > 0) {
            monthlyChange = ((monthlyEmissions - lastMonthEmissions) / lastMonthEmissions) * 100;
        } else if (monthlyEmissions > 0) {
            monthlyChange = 100.0;
        }

        // Total Emissions for current user (cumulative net)
        Double totalEmissionsSum = allUserActivities.stream()
                .filter(a -> a.getEmission() != null)
                .mapToDouble(Activity::getEmission)
                .sum();
        
        // Net Balance: Cumulative net capped at 0 as requested by user
        Double netBalance = Math.max(0.0, totalEmissionsSum);

        // Today's Emissions for current user
        LocalDateTime startOfDay = now.with(LocalTime.MIN);
        LocalDateTime endOfDay = now.with(LocalTime.MAX);
        Double todayEmissions = allUserActivities.stream()
                .filter(a -> a.getDate() != null && a.getDate().isAfter(startOfDay) && a.getDate().isBefore(endOfDay))
                .filter(a -> a.getEmission() != null)
                .mapToDouble(Activity::getEmission)
                .sum();
        todayEmissions = Math.max(0.0, todayEmissions);

        // Total Positive Emissions (to calculate how many trees are needed total)
        Double totalPositiveEmissions = allUserActivities.stream()
                .filter(a -> a.getEmission() != null && a.getEmission() > 0)
                .mapToDouble(Activity::getEmission)
                .sum();

        // Trees Already Planted
        int treesPlanted = allUserActivities.stream()
                .filter(a -> a.getType() == Activity.ActivityType.TREE_PLANTING)
                .mapToInt(a -> a.getValue().intValue())
                .sum();

        // Trees Needed: Based on user's screenshot 21kg per tree.
        int calculatedTotalTreesNeeded = (int) Math.ceil(totalPositiveEmissions / 21.0);
        int treesNeeded = Math.max(0, calculatedTotalTreesNeeded - treesPlanted);

        // Emissions by Category
        Map<String, Double> categoryEmissions = allUserActivities.stream()
                .filter(a -> a.getEmission() != null && a.getEmission() > 0)
                .collect(Collectors.groupingBy(
                        a -> a.getType().name().toLowerCase(),
                        Collectors.summingDouble(Activity::getEmission)
                ));

        // Timeline Data (Last 5 months)
        List<Map<String, Object>> timelineData = new ArrayList<>();
        for (int i = 4; i >= 0; i--) {
            LocalDateTime monthStart = now.minusMonths(i).withDayOfMonth(1).with(LocalTime.MIN);
            LocalDateTime monthEnd = monthStart.plusMonths(1).minusSeconds(1);
            if (i == 0) monthEnd = now.with(LocalTime.MAX);

            final LocalDateTime finalMonthStart = monthStart;
            final LocalDateTime finalMonthEnd = monthEnd;

            Double monthEmissions = allUserActivities.stream()
                    .filter(a -> a.getDate() != null && a.getDate().isAfter(finalMonthStart) && a.getDate().isBefore(finalMonthEnd))
                    .filter(a -> a.getEmission() != null && a.getEmission() > 0)
                    .mapToDouble(Activity::getEmission)
                    .sum();

            Map<String, Object> dataPoint = new HashMap<>();
            dataPoint.put("name", monthStart.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH));
            dataPoint.put("co2", monthEmissions);
            timelineData.add(dataPoint);
        }

        // Community Stats & Rank Calculation (Matching Leaderboard Logic)
        List<User> allUsers = userRepository.findAll();
        List<Activity> allGlobalActivities = activityRepository.findAll();
        Map<String, List<Activity>> globalActivitiesByUserId = allGlobalActivities.stream()
                .filter(a -> a.getUserId() != null)
                .collect(Collectors.groupingBy(Activity::getUserId));

        List<Double> allUserNetEmissions = new ArrayList<>();
        double totalNetForAll = 0.0;
        int totalActiveUsers = 0;

        for (User u : allUsers) {
            if (u.getId() == null) continue;
            
            List<Activity> uActivities = globalActivitiesByUserId.getOrDefault(u.getId(), new ArrayList<>());
            
            // For Rank & Comparison (Net Emission logic)
            if (!uActivities.isEmpty()) {
                Double uNet = uActivities.stream()
                        .filter(a -> a.getEmission() != null)
                        .mapToDouble(Activity::getEmission)
                        .sum();
                // Cap net at 0 for comparison consistency
                uNet = Math.max(0.0, uNet);
                
                allUserNetEmissions.add(uNet);
                totalNetForAll += uNet;
                totalActiveUsers++;
            }
        }
        
        // Community Average based on Net Emissions
        Double communityAverage = totalActiveUsers > 0 ? totalNetForAll / totalActiveUsers : netBalance;
        
        // Top Performer Emissions (Lowest net emission among active users)
        Double topPerformerEmissions = allUserNetEmissions.stream()
                .min(Double::compare)
                .orElse(netBalance);

        // Calculate Rank based on Net Emission
        Collections.sort(allUserNetEmissions);
        int userRank = allUserNetEmissions.indexOf(netBalance) + 1;
        if (userRank <= 0) userRank = 1;

        // Current Streak check
        int currentStreak = user.getStreakCount();
        LocalDate today = LocalDate.now();
        if (user.getLastLogDate() == null || (!user.getLastLogDate().equals(today) && !user.getLastLogDate().equals(today.minusDays(1)))) {
            currentStreak = 0;
            if (user.getStreakCount() != 0) {
                user.setStreakCount(0);
                userRepository.save(user);
            }
        }

        return new DashboardStatsDTO(
                todayEmissions,
                totalPositiveEmissions,
                monthlyChange,
                userRank,
                treesNeeded,
                treesPlanted,
                totalPositiveEmissions,
                communityAverage,
                netBalance,
                currentStreak,
                topPerformerEmissions,
                monthlyEmissions,
                categoryEmissions,
                timelineData
        );
    }

    public List<LeaderboardDTO> getLeaderboard() {
        List<User> allUsers = userRepository.findAll();
        List<Activity> allActivities = activityRepository.findAll();

        Map<String, List<Activity>> activitiesByUser = allActivities.stream()
                .filter(a -> a.getUserId() != null)
                .collect(Collectors.groupingBy(Activity::getUserId));

        List<LeaderboardDTO> leaderboard = new ArrayList<>();

        for (User user : allUsers) {
            try {
                List<Activity> userActivities = activitiesByUser.getOrDefault(user.getId(), new ArrayList<>());
                
                // Exclude users with no activities
                if (userActivities.isEmpty()) {
                    continue;
                }

                Double netEmission = userActivities.stream()
                        .filter(a -> a.getEmission() != null)
                        .mapToDouble(Activity::getEmission)
                        .sum();
                
                int treesPlanted = userActivities.stream()
                        .filter(a -> a.getType() == Activity.ActivityType.TREE_PLANTING)
                        .mapToInt(a -> a.getValue() != null ? a.getValue().intValue() : 0)
                        .sum();

                leaderboard.add(LeaderboardDTO.builder()
                        .name(user.getName() != null && !user.getName().isEmpty() ? user.getName() : user.getEmail())
                        .netEmission(netEmission)
                        .streakCount(user.getStreakCount())
                        .treesPlanted(treesPlanted)
                        .build());
            } catch (Exception e) {
                System.err.println("Error processing user " + user.getEmail() + ": " + e.getMessage());
                e.printStackTrace();
            }
        }

        // Sort by net emission ascending (lowest on top)
        leaderboard.sort(Comparator.comparing(LeaderboardDTO::getNetEmission));

        // Assign ranks
        for (int i = 0; i < leaderboard.size(); i++) {
            leaderboard.get(i).setRank(i + 1);
        }
        System.out.println("Leaderboard generated with " + leaderboard.size() + " entries");
        return leaderboard;
    }
}
