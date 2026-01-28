package com.carbontracker.controller;

import com.carbontracker.dto.ActivityDTO;
import com.carbontracker.model.Activity;
import com.carbontracker.service.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activity")
public class ActivityController {

    @Autowired
    private ActivityService activityService;

    @PostMapping("/add")
    public ResponseEntity<Activity> addActivity(@RequestBody ActivityDTO dto) {
        return ResponseEntity.ok(activityService.addActivity(dto));
    }

    @GetMapping("/user")
    public ResponseEntity<List<Activity>> getUserActivities() {
        return ResponseEntity.ok(activityService.getUserActivities());
    }
}
