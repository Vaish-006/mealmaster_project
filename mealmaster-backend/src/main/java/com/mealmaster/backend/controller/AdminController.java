package com.mealmaster.backend.controller;

import com.mealmaster.backend.entity.User;
import com.mealmaster.backend.repository.UserRepository;
import com.mealmaster.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private com.mealmaster.backend.repository.SubscriptionRepository subscriptionRepository;

    @Autowired
    private com.mealmaster.backend.repository.OrderRepository orderRepository;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers(
            @RequestHeader(value = "Authorization", required = false) String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.status(401).build();
        }
        try {
            validateAdmin(token);
            return ResponseEntity.ok(userRepository.findAll());
        } catch (Exception e) {
            return ResponseEntity.status(403).build();
        }
    }

    @GetMapping("/subscriptions")
    public ResponseEntity<List<com.mealmaster.backend.entity.Subscription>> getAllSubscriptions(
            @RequestHeader(value = "Authorization", required = false) String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.status(401).build();
        }
        try {
            validateAdmin(token);
            return ResponseEntity.ok(subscriptionRepository.findAll());
        } catch (Exception e) {
            return ResponseEntity.status(403).build();
        }
    }

    @GetMapping("/orders")
    public ResponseEntity<List<com.mealmaster.backend.entity.Order>> getAllOrders(
            @RequestHeader(value = "Authorization", required = false) String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.status(401).build();
        }
        try {
            validateAdmin(token);
            return ResponseEntity.ok(orderRepository.findAll());
        } catch (Exception e) {
            return ResponseEntity.status(403).build();
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.status(401).build();
        }
        try {
            validateAdmin(token);
            userRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(403).build();
        }
    }

    @DeleteMapping("/subscriptions/{id}")
    public ResponseEntity<?> deleteSubscription(@PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.status(401).build();
        }
        try {
            validateAdmin(token);
            subscriptionRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(403).build();
        }
    }

    private void validateAdmin(String token) {
        String email = jwtUtil.getEmailFromToken(token.replace("Bearer ", ""));
        User admin = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!admin.getRole().equals(User.Role.Admin)) {
            throw new RuntimeException("Unauthorized");
        }
    }
}