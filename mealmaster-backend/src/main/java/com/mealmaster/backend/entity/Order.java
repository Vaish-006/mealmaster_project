package com.mealmaster.backend.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "subscription_id")
    @JsonIgnoreProperties({ "vendor", "hibernateLazyInitializer", "handler" })
    private Subscription subscription;

    @Transient
    public Long getSubscriptionId() {
        return subscription != null ? subscription.getId() : null;
    }

    @Transient
    public Long getUserId() {
        return user != null ? user.getId() : null;
    }

    @Transient
    public Long getVendorId() {
        return (subscription != null && subscription.getVendor() != null) ? subscription.getVendor().getId() : null;
    }

    @Transient
    public Integer getDurationDays() {
        return duration;
    }

    @Transient
    public String getDeliveryAddress() {
        return String.format("%s, %s, %s - %s", addressLine, city, state, pincode);
    }

    @Transient
    public java.util.Map<String, String> getAddress() {
        java.util.Map<String, String> address = new java.util.HashMap<>();
        address.put("addressLine", addressLine);
        address.put("city", city);
        address.put("state", state);
        address.put("pincode", pincode);
        return address;
    }

    @Transient
    public LocalDateTime getCreatedAtUtc() {
        return orderDate;
    }

    private Integer duration; // 7, 15, or 30 days
    private BigDecimal amount;
    private LocalDateTime orderDate = LocalDateTime.now();
    private LocalDateTime startDate;
    private LocalDateTime endDate;

    private String addressLine;
    private String city;
    private String state;
    private String pincode;

    @Enumerated(EnumType.STRING)
    private OrderStatus status = OrderStatus.PENDING;

    public enum OrderStatus {
        PENDING, CONFIRMED, DELIVERED, CANCELLED
    }

    // Constructors
    public Order() {
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Subscription getSubscription() {
        return subscription;
    }

    public void setSubscription(Subscription subscription) {
        this.subscription = subscription;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public String getAddressLine() {
        return addressLine;
    }

    public void setAddressLine(String addressLine) {
        this.addressLine = addressLine;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPincode() {
        return pincode;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }
}