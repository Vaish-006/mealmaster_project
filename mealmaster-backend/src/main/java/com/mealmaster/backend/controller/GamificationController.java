package com.mealmaster.backend.controller;

import com.mealmaster.backend.service.GamificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/gamification")
@CrossOrigin(origins = "*")
public class GamificationController {

    @Autowired
    private GamificationService gamificationService;

    @GetMapping("/status/{userId}")
    public ResponseEntity<?> getStreakStatus(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(gamificationService.getStreakStatus(userId));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/log-meal/{userId}")
    public ResponseEntity<?> logMeal(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(gamificationService.logMeal(userId));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/redeem/{userId}")
    public ResponseEntity<?> redeemPoints(@PathVariable Long userId, @RequestBody Map<String, Integer> request) {
        try {
            int points = request.getOrDefault("points", 0);
            return ResponseEntity.ok(gamificationService.redeemPoints(userId, points));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
