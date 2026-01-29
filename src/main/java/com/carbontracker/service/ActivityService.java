package com.carbontracker.service;

import com.carbontracker.dto.ActivityDTO;
import com.carbontracker.dto.DashboardStatsDTO;
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
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ActivityService {

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmissionFactorService emissionFactorService;

    public Activity addActivity(ActivityDTO dto) {
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

        return activityRepository.save(activity);
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

        return activityRepository.findByUserIdAndDateBetween(user.getId(), start, end)
                .stream()
                .filter(a -> a.getEmission() != null)
                .mapToDouble(Activity::getEmission)
                .sum();
    }

    public Double getMonthlyEmissions() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDateTime start = LocalDateTime.of(LocalDate.now().withDayOfMonth(1), LocalTime.MIN);
        LocalDateTime end = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);

        return activityRepository.findByUserIdAndDateBetween(user.getId(), start, end)
                .stream()
                .filter(a -> a.getEmission() != null)
                .mapToDouble(Activity::getEmission)
                .sum();
    }

    public DashboardStatsDTO getDashboardStats() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfMonth = now.withDayOfMonth(1).with(LocalTime.MIN);
        LocalDateTime endOfMonth = now.with(LocalTime.MAX);
        
        // Current Month Emissions for current user
        Double monthlyEmissions = activityRepository.findByUserIdAndDateBetween(user.getId(), startOfMonth, endOfMonth)
                .stream()
                .filter(a -> a != null && a.getEmission() != null)
                .mapToDouble(Activity::getEmission)
                .sum();

        // Previous Month Emissions for current user
        LocalDateTime startOfLastMonth = startOfMonth.minusMonths(1);
        LocalDateTime endOfLastMonth = startOfMonth.minusSeconds(1);
        Double lastMonthEmissions = activityRepository.findByUserIdAndDateBetween(user.getId(), startOfLastMonth, endOfLastMonth)
                .stream()
                .filter(a -> a != null && a.getEmission() != null)
                .mapToDouble(Activity::getEmission)
                .sum();

        Double monthlyChange = 0.0;
        if (lastMonthEmissions > 0) {
            monthlyChange = ((monthlyEmissions - lastMonthEmissions) / lastMonthEmissions) * 100;
        } else if (monthlyEmissions > 0) {
            monthlyChange = 100.0;
        }

        // Total Emissions for current user
        Double totalEmissions = activityRepository.findByUserId(user.getId())
                .stream()
                .filter(a -> a != null && a.getEmission() != null)
                .mapToDouble(Activity::getEmission)
                .sum();

        // Today's Emissions for current user
        LocalDateTime startOfDay = now.with(LocalTime.MIN);
        LocalDateTime endOfDay = now.with(LocalTime.MAX);
        Double todayEmissions = activityRepository.findByUserIdAndDateBetween(user.getId(), startOfDay, endOfDay)
                .stream()
                .filter(a -> a != null && a.getEmission() != null)
                .mapToDouble(Activity::getEmission)
                .sum();

        // Total Positive Emissions (to calculate how many trees are needed total)
        Double totalPositiveEmissions = activityRepository.findByUserId(user.getId())
                .stream()
                .filter(a -> a != null && a.getEmission() != null && a.getEmission() > 0)
                .mapToDouble(Activity::getEmission)
                .sum();

        // Trees Already Planted
        int treesPlanted = activityRepository.findByUserId(user.getId())
                .stream()
                .filter(a -> a != null && a.getType() == Activity.ActivityType.TREE_PLANTING)
                .mapToInt(a -> a.getValue().intValue())
                .sum();

        // Trees Needed: Based on user's screenshot 21kg per tree.
        int calculatedTotalTreesNeeded = (int) Math.ceil(totalPositiveEmissions / 21.0);
        int treesNeeded = Math.max(0, calculatedTotalTreesNeeded - treesPlanted);

        // Community Stats
        List<User> allUsers = userRepository.findAll();
        double totalMonthlyForAll = 0.0;
        int activeUsersThisMonth = 0;
        List<Double> allUserMonthlyEmissions = new java.util.ArrayList<>();

        for (User u : allUsers) {
            if (u.getId() == null) continue;
            
            Double uMonthly = activityRepository.findByUserIdAndDateBetween(u.getId(), startOfMonth, endOfMonth)
                    .stream()
                    .filter(a -> a != null && a.getEmission() != null)
                    .mapToDouble(Activity::getEmission)
                    .sum();
            
            allUserMonthlyEmissions.add(uMonthly);
            if (uMonthly > 0) {
                totalMonthlyForAll += uMonthly;
                activeUsersThisMonth++;
            }
        }
        
        Double communityAverage = activeUsersThisMonth > 0 ? totalMonthlyForAll / activeUsersThisMonth : 19.8;
        
        // Calculate Rank (lower emission = better rank)
        // Sort ascending: [0.0, 5.0, 10.0, 20.0]
        java.util.Collections.sort(allUserMonthlyEmissions);
        int userRank = allUserMonthlyEmissions.indexOf(monthlyEmissions) + 1;
        if (userRank <= 0) userRank = 1;

        return new DashboardStatsDTO(
                todayEmissions,
                totalPositiveEmissions,
                monthlyChange,
                userRank,
                treesNeeded,
                treesPlanted,
                totalPositiveEmissions,
                communityAverage
        );
    }
}
