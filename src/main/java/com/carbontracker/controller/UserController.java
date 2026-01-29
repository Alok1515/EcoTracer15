package com.carbontracker.controller;

import com.carbontracker.dto.AuthResponse;
import com.carbontracker.dto.UpdateProfileRequest;
import com.carbontracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @PutMapping("/profile")
    public ResponseEntity<AuthResponse> updateProfile(
            Authentication authentication,
            @RequestBody UpdateProfileRequest request) {
        String currentEmail = authentication.getName();
        return ResponseEntity.ok(userService.updateProfile(currentEmail, request));
    }

    @DeleteMapping("/account")
    public ResponseEntity<Void> deleteAccount(Authentication authentication) {
        String email = authentication.getName();
        userService.deleteAccount(email);
        return ResponseEntity.noContent().build();
    }
}
