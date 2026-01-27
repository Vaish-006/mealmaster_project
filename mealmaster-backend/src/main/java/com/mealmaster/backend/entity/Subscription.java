package com.mealmaster.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.math.BigDecimal;

@Entity
@Table(name = "subscriptions")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Subscription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @NotBlank
    private String description;

    @NotBlank
    private String city;

    @Enumerated(EnumType.STRING)
    private PlanType planType = PlanType.Veg;

    private String imageUrl;

    @NotNull
    private BigDecimal price7;

    @NotNull
    private BigDecimal price15;

    @NotNull
    private BigDecimal price30;

    @NotBlank
    private String day1;

    @NotBlank
    private String day2;

    @NotBlank
    private String day3;

    @NotBlank
    private String day4;

    @NotBlank
    private String day5;

    @NotBlank
    private String day6;

    @NotBlank
    private String day7;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "vendor_id")
    @JsonIgnoreProperties({"password", "hibernateLazyInitializer", "handler"})
    private User vendor;

    @Transient
    public Long getVendorId() {
        return vendor != null ? vendor.getId() : null;
    }

    public enum PlanType {
        Veg, NonVeg, Mix
    }

    // Constructors
    public Subscription() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public PlanType getPlanType() { return planType; }
    public void setPlanType(PlanType planType) { this.planType = planType; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public BigDecimal getPrice7() { return price7; }
    public void setPrice7(BigDecimal price7) { this.price7 = price7; }

    public BigDecimal getPrice15() { return price15; }
    public void setPrice15(BigDecimal price15) { this.price15 = price15; }

    public BigDecimal getPrice30() { return price30; }
    public void setPrice30(BigDecimal price30) { this.price30 = price30; }

    public String getDay1() { return day1; }
    public void setDay1(String day1) { this.day1 = day1; }

    public String getDay2() { return day2; }
    public void setDay2(String day2) { this.day2 = day2; }

    public String getDay3() { return day3; }
    public void setDay3(String day3) { this.day3 = day3; }

    public String getDay4() { return day4; }
    public void setDay4(String day4) { this.day4 = day4; }

    public String getDay5() { return day5; }
    public void setDay5(String day5) { this.day5 = day5; }

    public String getDay6() { return day6; }
    public void setDay6(String day6) { this.day6 = day6; }

    public String getDay7() { return day7; }
    public void setDay7(String day7) { this.day7 = day7; }

    public User getVendor() { return vendor; }
    public void setVendor(User vendor) { this.vendor = vendor; }
}