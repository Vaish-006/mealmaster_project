package com.mealmaster.backend.controller;

import com.mealmaster.backend.entity.Subscription;
import com.mealmaster.backend.entity.User;
import com.mealmaster.backend.repository.SubscriptionRepository;
import com.mealmaster.backend.repository.UserRepository;
import com.mealmaster.backend.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
@CrossOrigin(origins = "*")
public class SubscriptionController {

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/mine")
    public ResponseEntity<?> getMySubscriptions(@RequestHeader(value = "Authorization", required = false) String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body("No token provided");
        }
        try {
            String email = jwtUtil.getEmailFromToken(token.replace("Bearer ", ""));
            User vendor = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            List<Subscription> subscriptions = subscriptionRepository.findByVendor(vendor);
            System.out.println("Found " + subscriptions.size() + " subscriptions for vendor: " + email);
            return ResponseEntity.ok(subscriptions);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping
    public List<Subscription> getAllSubscriptions(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String planType) {
        
        if (city != null && planType != null) {
            return subscriptionRepository.findByCityIgnoreCaseAndPlanType(city, Subscription.PlanType.valueOf(planType));
        } else if (city != null) {
            return subscriptionRepository.findByCityIgnoreCase(city);
        } else if (planType != null) {
            return subscriptionRepository.findByPlanType(Subscription.PlanType.valueOf(planType));
        }
        return subscriptionRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Subscription> getSubscription(@PathVariable Long id) {
        return subscriptionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Subscription> createSubscription(@Valid @RequestBody SubscriptionRequest request, 
                                                         @RequestHeader("Authorization") String token) {
        String email = jwtUtil.getEmailFromToken(token.replace("Bearer ", ""));
        User vendor = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Subscription subscription = new Subscription();
        subscription.setName(request.getName());
        subscription.setDescription(request.getDescription());
        subscription.setCity(request.getCity());
        subscription.setPlanType(Subscription.PlanType.valueOf(request.getPlanType()));
        subscription.setImageUrl(request.getImageUrl());
        subscription.setPrice7(BigDecimal.valueOf(request.getPrice7()));
        subscription.setPrice15(BigDecimal.valueOf(request.getPrice15()));
        subscription.setPrice30(BigDecimal.valueOf(request.getPrice30()));
        subscription.setDay1(request.getDay1());
        subscription.setDay2(request.getDay2());
        subscription.setDay3(request.getDay3());
        subscription.setDay4(request.getDay4());
        subscription.setDay5(request.getDay5());
        subscription.setDay6(request.getDay6());
        subscription.setDay7(request.getDay7());
        subscription.setVendor(vendor);

        return ResponseEntity.ok(subscriptionRepository.save(subscription));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Subscription> updateSubscription(@PathVariable Long id, 
                                                         @Valid @RequestBody SubscriptionRequest request,
                                                         @RequestHeader("Authorization") String token) {
        String email = jwtUtil.getEmailFromToken(token.replace("Bearer ", ""));
        User vendor = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return subscriptionRepository.findById(id)
                .map(subscription -> {
                    if (!subscription.getVendor().getId().equals(vendor.getId())) {
                        throw new RuntimeException("Unauthorized");
                    }
                    subscription.setName(request.getName());
                    subscription.setDescription(request.getDescription());
                    subscription.setCity(request.getCity());
                    subscription.setPlanType(Subscription.PlanType.valueOf(request.getPlanType()));
                    subscription.setImageUrl(request.getImageUrl());
                    subscription.setPrice7(BigDecimal.valueOf(request.getPrice7()));
                    subscription.setPrice15(BigDecimal.valueOf(request.getPrice15()));
                    subscription.setPrice30(BigDecimal.valueOf(request.getPrice30()));
                    subscription.setDay1(request.getDay1());
                    subscription.setDay2(request.getDay2());
                    subscription.setDay3(request.getDay3());
                    subscription.setDay4(request.getDay4());
                    subscription.setDay5(request.getDay5());
                    subscription.setDay6(request.getDay6());
                    subscription.setDay7(request.getDay7());
                    return ResponseEntity.ok(subscriptionRepository.save(subscription));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSubscription(@PathVariable Long id, 
                                              @RequestHeader("Authorization") String token) {
        String email = jwtUtil.getEmailFromToken(token.replace("Bearer ", ""));
        User vendor = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return subscriptionRepository.findById(id)
                .map(subscription -> {
                    if (!subscription.getVendor().getId().equals(vendor.getId())) {
                        throw new RuntimeException("Unauthorized");
                    }
                    subscriptionRepository.delete(subscription);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    public static class SubscriptionRequest {
        private String name;
        private String description;
        private String city;
        private String planType;
        private String imageUrl;
        private double price7;
        private double price15;
        private double price30;
        private String day1;
        private String day2;
        private String day3;
        private String day4;
        private String day5;
        private String day6;
        private String day7;

        // Getters and Setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }
        public String getPlanType() { return planType; }
        public void setPlanType(String planType) { this.planType = planType; }
        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
        public double getPrice7() { return price7; }
        public void setPrice7(double price7) { this.price7 = price7; }
        public double getPrice15() { return price15; }
        public void setPrice15(double price15) { this.price15 = price15; }
        public double getPrice30() { return price30; }
        public void setPrice30(double price30) { this.price30 = price30; }
        public String getDay1() { return day1; }
        public void setDay1(String day1) { this.day1 = day1; }
        public String getDay2() { return day2; }
        public void setDay2(String day2) { this.day2 = day2; }
        public String getDay3() { return day3; }
        public void setDay3(String day3) { this.day3 = day3; }
        public String getDay4() { return day4; }
        public void setDay4(String day4) { this.day4 = day4; }
        public String getDay5() { return day5; }
        public void setDay5(String day5) { this.day5 = day5; }
        public String getDay6() { return day6; }
        public void setDay6(String day6) { this.day6 = day6; }
        public String getDay7() { return day7; }
        public void setDay7(String day7) { this.day7 = day7; }
    }
}