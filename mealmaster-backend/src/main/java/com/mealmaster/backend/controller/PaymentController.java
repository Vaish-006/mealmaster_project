package com.mealmaster.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class PaymentController {

    @PostMapping("/{id}/pay")
    public ResponseEntity<Map<String, String>> processPayment(@PathVariable Long id, 
                                                            @RequestHeader(value = "Authorization", required = false) String token) {
        // Simple mock payment - always succeeds
        return ResponseEntity.ok(Map.of("status", "success", "message", "Payment processed"));
    }
}