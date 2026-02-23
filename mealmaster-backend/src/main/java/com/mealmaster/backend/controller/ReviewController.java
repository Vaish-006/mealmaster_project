package com.mealmaster.backend.controller;

import com.mealmaster.backend.entity.Review;
import com.mealmaster.backend.entity.Subscription;
import com.mealmaster.backend.entity.User;
import com.mealmaster.backend.repository.ReviewRepository;
import com.mealmaster.backend.repository.SubscriptionRepository;
import com.mealmaster.backend.repository.UserRepository;
import com.mealmaster.backend.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/subscription/{subscriptionId}")
    public List<Review> getSubscriptionReviews(@PathVariable Long subscriptionId) {
        System.out.println("Fetching reviews for subscription ID: " + subscriptionId);
        List<Review> reviews = reviewRepository.findBySubscriptionIdOrderByCreatedAtDesc(subscriptionId);
        System.out.println("Found " + reviews.size() + " reviews");
        return reviews;
    }

    @PostMapping
    public ResponseEntity<?> addReview(@Valid @RequestBody ReviewRequest request,
            @RequestHeader("Authorization") String token) {
        try {
            System.out.println("Adding review for subscription ID: " + request.getSubscriptionId());
            String email = jwtUtil.getEmailFromToken(token.replace("Bearer ", ""));
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Subscription subscription = subscriptionRepository.findById(request.getSubscriptionId())
                    .orElseThrow(() -> new RuntimeException("Subscription not found"));

            Review review = new Review();
            review.setRating(request.getRating());
            review.setComment(request.getComment());
            review.setFoodImageUrl(request.getFoodImageUrl());
            review.setUser(user);
            review.setSubscription(subscription);
            review.setCreatedAt(LocalDateTime.now());

            Review saved = reviewRepository.save(review);
            System.out.println("Review added successfully with ID: " + saved.getId());
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            System.err.println("Error adding review: " + e.getMessage());
            return ResponseEntity.status(403).body("Error: " + e.getMessage());
        }
    }

    public static class ReviewRequest {
        private Long subscriptionId;
        private Integer rating;
        private String comment;
        private String foodImageUrl;

        // Getters and Setters
        public Long getSubscriptionId() {
            return subscriptionId;
        }

        public void setSubscriptionId(Long subscriptionId) {
            this.subscriptionId = subscriptionId;
        }

        public Integer getRating() {
            return rating;
        }

        public void setRating(Integer rating) {
            this.rating = rating;
        }

        public String getComment() {
            return comment;
        }

        public void setComment(String comment) {
            this.comment = comment;
        }

        public String getFoodImageUrl() {
            return foodImageUrl;
        }

        public void setFoodImageUrl(String foodImageUrl) {
            this.foodImageUrl = foodImageUrl;
        }
    }
}
