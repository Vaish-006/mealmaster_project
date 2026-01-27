package com.mealmaster.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("MealMaster - Email Verification OTP");
        message.setText("Your OTP for MealMaster registration is: " + otp + 
                       "\n\nThis OTP will expire in 5 minutes." +
                       "\n\nIf you didn't request this, please ignore this email.");
        message.setFrom("noreply@mealmaster.com");
        
        mailSender.send(message);
    }
}