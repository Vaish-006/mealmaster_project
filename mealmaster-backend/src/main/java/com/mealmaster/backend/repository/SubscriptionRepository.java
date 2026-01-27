package com.mealmaster.backend.repository;

import com.mealmaster.backend.entity.Subscription;
import com.mealmaster.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    List<Subscription> findByVendor(User vendor);
    List<Subscription> findByCity(String city);
    List<Subscription> findByCityIgnoreCase(String city);
    List<Subscription> findByPlanType(Subscription.PlanType planType);
    List<Subscription> findByCityAndPlanType(String city, Subscription.PlanType planType);
    List<Subscription> findByCityIgnoreCaseAndPlanType(String city, Subscription.PlanType planType);
}