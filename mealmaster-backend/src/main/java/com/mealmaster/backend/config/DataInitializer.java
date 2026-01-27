package com.mealmaster.backend.config;

import com.mealmaster.backend.entity.User;
import com.mealmaster.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create Admin User if not exists
        if (!userRepository.existsByEmail("admin@mealmaster.com")) {
            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@mealmaster.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(User.Role.Admin);
            admin.setMobile("9999999999");
            admin.setCity("Mumbai");
            admin.setState("Maharashtra");
            admin.setPincode("400001");
            admin.setAddressLine("Admin HQ");
            userRepository.save(admin);
            System.out.println("✅ Admin user created: admin@mealmaster.com / admin123");
        }

        // Create Regular User if not exists
        if (!userRepository.existsByEmail("user@mealmaster.com")) {
            User user = new User();
            user.setName("Test User");
            user.setEmail("user@mealmaster.com");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setRole(User.Role.User);
            user.setMobile("8888888888");
            user.setCity("Pune");
            user.setState("Maharashtra");
            user.setPincode("411001");
            user.setAddressLine("User Resident");
            userRepository.save(user);
            System.out.println("✅ Test user created: user@mealmaster.com / user123");
        }

        // Create Vendor User if not exists
        if (!userRepository.existsByEmail("vendor@mealmaster.com")) {
            User vendor = new User();
            vendor.setName("Test Vendor");
            vendor.setEmail("vendor@mealmaster.com");
            vendor.setPassword(passwordEncoder.encode("vendor123"));
            vendor.setRole(User.Role.Vendor);
            vendor.setMobile("7777777777");
            vendor.setCity("Delhi");
            vendor.setState("Delhi");
            vendor.setPincode("110001");
            vendor.setAddressLine("Vendor Kitchens");
            userRepository.save(vendor);
            System.out.println("✅ Test vendor created: vendor@mealmaster.com / vendor123");
        }
    }
}
