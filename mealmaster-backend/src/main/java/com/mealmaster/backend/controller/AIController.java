package com.mealmaster.backend.controller;

import com.mealmaster.backend.dto.AIRecommendationRequest;
import com.mealmaster.backend.service.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIController {

    @Autowired
    private GeminiService geminiService;

    @PostMapping("/recommend")
    public ResponseEntity<?> getRecommendations(@RequestBody AIRecommendationRequest request) {
        try {
            Map<String, Object> recommendations = geminiService.getRecommendations(
                    request.getGoal(),
                    request.getRestrictions());
            return ResponseEntity.ok(recommendations);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}
