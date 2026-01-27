package com.mealmaster.backend.repository;

import com.mealmaster.backend.entity.Order;
import com.mealmaster.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
    
    @Query("SELECT o FROM Order o WHERE o.subscription.vendor = ?1")
    List<Order> findByVendor(User vendor);
}