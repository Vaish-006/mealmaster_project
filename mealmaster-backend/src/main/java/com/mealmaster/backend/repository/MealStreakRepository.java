package com.mealmaster.backend.repository;

import com.mealmaster.backend.entity.MealStreak;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MealStreakRepository extends JpaRepository<MealStreak, Long> {
    Optional<MealStreak> findByUserId(Long userId);
}
