package com.carbontracker.service;

import com.carbontracker.dto.ActivityDTO;
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
                .mapToDouble(Activity::getEmission)
                .sum();
    }
}
