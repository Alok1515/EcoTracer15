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

        // Current Month
        LocalDateTime startOfMonth = LocalDateTime.of(LocalDate.now().withDayOfMonth(1), LocalTime.MIN);
        LocalDateTime endOfMonth = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);
        Double monthlyEmissions = activityRepository.findByUserIdAndDateBetween(user.getId(), startOfMonth, endOfMonth)
                .stream()
                .filter(a -> a.getEmission() != null)
                .mapToDouble(Activity::getEmission)
                .sum();

        // Previous Month
        LocalDateTime startOfLastMonth = startOfMonth.minusMonths(1);
        LocalDateTime endOfLastMonth = startOfMonth.minusSeconds(1);
        Double lastMonthEmissions = activityRepository.findByUserIdAndDateBetween(user.getId(), startOfLastMonth, endOfLastMonth)
                .stream().mapToDouble(Activity::getEmission).sum();

        Double monthlyChange = 0.0;
        if (lastMonthEmissions > 0) {
            monthlyChange = ((monthlyEmissions - lastMonthEmissions) / lastMonthEmissions) * 100;
        } else if (monthlyEmissions > 0) {
            monthlyChange = 100.0;
        }

        // Total
        Double totalEmissions = activityRepository.findByUserId(user.getId())
                .stream()
                .filter(a -> a.getEmission() != null)
                .mapToDouble(Activity::getEmission)
                .sum();

        // Today
        LocalDateTime startOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
        LocalDateTime endOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);
        Double todayEmissions = activityRepository.findByUserIdAndDateBetween(user.getId(), startOfDay, endOfDay)
                .stream()
                .filter(a -> a.getEmission() != null)
                .mapToDouble(Activity::getEmission)
                .sum();

        // Trees Needed: Approx 22kg CO2 per tree per year.
        int treesNeeded = (int) Math.ceil(totalEmissions / 22.0);

        // Community Average (Simplified for this exercise)
        List<User> allUsers = userRepository.findAll();
        double totalMonthlyForAll = 0.0;
        int activeUsersThisMonth = 0;
        for (User u : allUsers) {
            Double uMonthly = activityRepository.findByUserIdAndDateBetween(u.getId(), startOfMonth, endOfMonth)
                    .stream()
                    .filter(a -> a.getEmission() != null)
                    .mapToDouble(Activity::getEmission)
                    .sum();
            if (uMonthly > 0) {
                totalMonthlyForAll += uMonthly;
                activeUsersThisMonth++;
            }
        }
        Double communityAverage = activeUsersThisMonth > 0 ? totalMonthlyForAll / activeUsersThisMonth : 19.8;

        return new DashboardStatsDTO(
                todayEmissions,
                totalEmissions,
                monthlyChange,
                11, // userRank
                treesNeeded,
                communityAverage
        );
    }
}
