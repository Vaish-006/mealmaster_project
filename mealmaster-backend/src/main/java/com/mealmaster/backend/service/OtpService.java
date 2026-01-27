package com.mealmaster.backend.service;

import com.mealmaster.backend.entity.OtpVerification;
import com.mealmaster.backend.repository.OtpVerificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class OtpService {

    @Autowired
    private OtpVerificationRepository otpRepository;

    @Autowired
    private EmailService emailService;

    public String generateOtp(String email) {
        try {
            String otp = String.format("%06d", new Random().nextInt(999999));
            LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(5);
            
            // Delete existing OTPs for this email
            otpRepository.deleteByEmail(email);
            
            OtpVerification otpVerification = new OtpVerification(email, otp, expiryTime);
            otpRepository.save(otpVerification);
            
            // Send OTP via email
            emailService.sendOtpEmail(email, otp);
            System.out.println("OTP sent to email: " + email);
            
            return otp;
        } catch (Exception e) {
            System.err.println("Error sending OTP: " + e.getMessage());
            // Fallback - print to console if email fails
            System.out.println("Email failed. OTP for " + email + ": " + String.format("%06d", new Random().nextInt(999999)));
            throw new RuntimeException("Failed to send OTP email: " + e.getMessage());
        }
    }

    @Transactional
    public boolean verifyOtp(String email, String otp) {
        return otpRepository.findByEmailAndOtpAndVerifiedFalse(email, otp)
                .map(otpVerification -> {
                    if (otpVerification.getExpiryTime().isAfter(LocalDateTime.now())) {
                        otpVerification.setVerified(true);
                        otpRepository.save(otpVerification);
                        return true;
                    }
                    return false;
                }).orElse(false);
    }
}