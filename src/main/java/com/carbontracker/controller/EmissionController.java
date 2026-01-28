package com.carbontracker.controller;

import com.carbontracker.service.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/emission")
public class EmissionController {

    @Autowired
    private ActivityService activityService;

    @GetMapping("/today")
    public ResponseEntity<Double> getTodayEmissions() {
        return ResponseEntity.ok(activityService.getTodayEmissions());
    }

    @GetMapping("/monthly")
    public ResponseEntity<Double> getMonthlyEmissions() {
        return ResponseEntity.ok(activityService.getMonthlyEmissions());
    }
}
