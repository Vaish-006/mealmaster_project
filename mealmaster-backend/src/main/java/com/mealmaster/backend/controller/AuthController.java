package com.mealmaster.backend.controller;

import com.mealmaster.backend.dto.*;
import com.mealmaster.backend.entity.User;
import com.mealmaster.backend.repository.UserRepository;
import com.mealmaster.backend.security.JwtUtil;
import com.mealmaster.backend.service.OtpService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private OtpService otpService;

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@Valid @RequestBody OtpRequest request) {
        try {
            System.out.println("Received OTP request for email: " + request.getEmail());

            if (userRepository.existsByEmail(request.getEmail())) {
                return ResponseEntity.status(400).body(Map.of("message", "Email already exists"));
            }

            String otp = otpService.generateOtp(request.getEmail());
            System.out.println("Generated OTP: " + otp + " for email: " + request.getEmail());

            return ResponseEntity.ok(Map.of("message", "OTP sent successfully"));
        } catch (Exception e) {
            System.err.println("Error sending OTP: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "Failed to send OTP: " + e.getMessage()));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@Valid @RequestBody OtpVerifyRequest request) {
        try {
            boolean isValid = otpService.verifyOtp(request.getEmail(), request.getOtp());
            if (isValid) {
                return ResponseEntity.ok(Map.of("message", "OTP verified successfully"));
            } else {
                return ResponseEntity.status(400).body(Map.of("message", "Invalid or expired OTP"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("message", "OTP verification failed"));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                System.out.println("Login failed: Email is missing or empty");
                return ResponseEntity.status(400).body(Map.of("message", "Email is required"));
            }
            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                System.out.println("Login failed: Password is missing or empty");
                return ResponseEntity.status(400).body(Map.of("message", "Password is required"));
            }

            System.out.println("Attempting login for email: " + request.getEmail().trim());
            User user = userRepository.findByEmail(request.getEmail().trim())
                    .orElse(null);

            if (user == null) {
                System.out.println("Login failed: User not found with email " + request.getEmail());
                return ResponseEntity.status(400).body(Map.of("message", "User not found with this email"));
            }

            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                System.out.println("Login failed: Invalid password for email " + request.getEmail());
                return ResponseEntity.status(400).body(Map.of("message", "Invalid password"));
            }

            System.out.println("Login successful for email: " + request.getEmail());
            String token = jwtUtil.generateToken(user);
            return ResponseEntity.ok(new AuthResponse(token, user.getId(), user.getName(),
                    user.getEmail(), user.getRole().toString(), user.getCity()));
        } catch (Exception e) {
            System.err.println("Login error: " + e.getMessage());
            return ResponseEntity.status(400).body(Map.of("message", "Login failed: " + e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            if (userRepository.existsByEmail(request.getEmail())) {
                return ResponseEntity.status(400).body(Map.of("message", "Email already exists"));
            }

            User user = new User();
            user.setName(request.getName());
            user.setEmail(request.getEmail());
            user.setMobile(request.getMobile());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setRole(User.Role.valueOf(request.getRole()));
            user.setAddressLine(request.getAddressLine());
            user.setCity(request.getCity());
            user.setState(request.getState());
            user.setPincode(request.getPincode());

            user = userRepository.save(user);
            String token = jwtUtil.generateToken(user);
            return ResponseEntity.ok(new AuthResponse(token, user.getId(), user.getName(),
                    user.getEmail(), user.getRole().toString(), user.getCity()));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("message", e.getMessage()));
        }
    }
}