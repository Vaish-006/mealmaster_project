package com.mealmaster.backend.service;

import com.mealmaster.backend.entity.MealStreak;
import com.mealmaster.backend.entity.User;
import com.mealmaster.backend.repository.MealStreakRepository;
import com.mealmaster.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Service
public class GamificationService {

    @Autowired
    private MealStreakRepository mealStreakRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Map<String, Object> logMeal(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        MealStreak streak = mealStreakRepository.findByUserId(userId)
                .orElse(new MealStreak(user));

        LocalDate today = LocalDate.now();
        LocalDate lastDate = streak.getLastMealDate();

        boolean streakUpdated = false;
        String message = "Meal logged successfully!";

        if (lastDate == null) {
            streak.setCurrentStreak(1);
            streak.setTotalPoints(streak.getTotalPoints() + 10);
            streakUpdated = true;
        } else if (lastDate.isBefore(today)) {
            if (lastDate.equals(today.minusDays(1))) {
                streak.setCurrentStreak(streak.getCurrentStreak() + 1);
                streak.setTotalPoints(streak.getTotalPoints() + 10);
                message = "Streak continued! You're on a " + streak.getCurrentStreak() + " day streak!";
            } else {
                streak.setCurrentStreak(1);
                streak.setTotalPoints(streak.getTotalPoints() + 10);
                message = "Streak restarted. Keep it going!";
            }
            streakUpdated = true;
        } else {
            message = "You've already logged your meal for today!";
        }

        if (streakUpdated) {
            streak.setLastMealDate(today);
            if (streak.getCurrentStreak() > streak.getLongestStreak()) {
                streak.setLongestStreak(streak.getCurrentStreak());
            }

            // Special reward for 15-day streak
            if (streak.getCurrentStreak() == 15) {
                message += " CONGRATULATIONS! You hit a 15-day streak! You've unlocked a 5% discount for your next month!";
            }

            mealStreakRepository.save(streak);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("currentStreak", streak.getCurrentStreak());
        result.put("totalPoints", streak.getTotalPoints());
        result.put("longestStreak", streak.getLongestStreak());
        result.put("message", message);
        result.put("eligibleForDiscount", streak.getCurrentStreak() >= 15);

        return result;
    }

    public Map<String, Object> getStreakStatus(Long userId) {
        MealStreak streak = mealStreakRepository.findByUserId(userId)
                .orElse(new MealStreak());

        Map<String, Object> result = new HashMap<>();
        result.put("currentStreak", streak.getCurrentStreak());
        result.put("totalPoints", streak.getTotalPoints());
        result.put("longestStreak", streak.getLongestStreak());
        result.put("lastMealDate", streak.getLastMealDate());
        result.put("eligibleForDiscount", streak.getCurrentStreak() >= 15);

        return result;
    }

    @Transactional
    public Map<String, Object> redeemPoints(Long userId, int pointsToRedeem) {
        MealStreak streak = mealStreakRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("No streak data found for user"));

        if (streak.getTotalPoints() < pointsToRedeem) {
            throw new RuntimeException("Insufficient points! You have " + streak.getTotalPoints() + " points.");
        }

        double discountAmount = pointsToRedeem / 10.0; // 10 points = 1 Rs
        streak.setTotalPoints(streak.getTotalPoints() - pointsToRedeem);
        mealStreakRepository.save(streak);

        Map<String, Object> result = new HashMap<>();
        result.put("discountAmount", discountAmount);
        result.put("remainingPoints", streak.getTotalPoints());
        result.put("message", "Success! You saved ₹" + discountAmount + " using " + pointsToRedeem + " points.");

        return result;
    }
}
