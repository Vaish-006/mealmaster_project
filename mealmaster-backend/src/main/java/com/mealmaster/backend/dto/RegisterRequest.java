package com.mealmaster.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class RegisterRequest {
    @NotBlank(message = "Name is required")
    @Pattern(regexp = "^[a-zA-Z\\s]{2,50}$", message = "Name must contain only letters and spaces (2-50 characters)")
    private String name;

    @Email(message = "Valid email is required")
    @NotBlank(message = "Email is required")
    @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", message = "Please enter a valid email address")
    private String email;

    @NotBlank(message = "Mobile is required")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Mobile must be a valid 10-digit Indian number starting with 6-9")
    private String mobile;

    @NotBlank(message = "Password is required")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$", 
             message = "Password must be 8+ characters with uppercase, lowercase, number and special character")
    private String password;

    @NotBlank(message = "Role is required")
    @Pattern(regexp = "^(User|Vendor|Admin)$", message = "Role must be User, Vendor, or Admin")
    private String role;

    @NotBlank(message = "Address is required")
    @Pattern(regexp = "^[a-zA-Z0-9\\s,.-]{5,100}$", 
             message = "Address must be 5-100 characters with letters, numbers, spaces and basic punctuation")
    private String addressLine;

    @NotBlank(message = "City is required")
    @Pattern(regexp = "^[a-zA-Z\\s]{2,30}$", message = "City must contain only letters and spaces (2-30 characters)")
    private String city;

    @NotBlank(message = "State is required")
    @Pattern(regexp = "^[a-zA-Z\\s]{2,30}$", message = "State must contain only letters and spaces (2-30 characters)")
    private String state;

    @NotBlank(message = "Pincode is required")
    @Pattern(regexp = "^[1-9][0-9]{5}$", message = "Pincode must be 6 digits and cannot start with 0")
    private String pincode;

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getAddressLine() { return addressLine; }
    public void setAddressLine(String addressLine) { this.addressLine = addressLine; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }
}