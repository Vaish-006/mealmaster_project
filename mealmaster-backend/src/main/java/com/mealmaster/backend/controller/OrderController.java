package com.mealmaster.backend.controller;

import com.mealmaster.backend.entity.Order;
import com.mealmaster.backend.entity.User;
import com.mealmaster.backend.repository.OrderRepository;
import com.mealmaster.backend.repository.UserRepository;
import com.mealmaster.backend.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private com.mealmaster.backend.repository.SubscriptionRepository subscriptionRepository;

    @PostMapping
    public ResponseEntity<?> createOrder(@Valid @RequestBody OrderRequest request,
            @RequestHeader(value = "Authorization", required = false) String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        try {
            String email = jwtUtil.getEmailFromToken(token.replace("Bearer ", ""));
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            System.out.println("Creating order for user: " + user.getId() + " (" + email + ")");

            com.mealmaster.backend.entity.Subscription subscription = subscriptionRepository
                    .findById(request.getSubscriptionId())
                    .orElseThrow(() -> new RuntimeException("Subscription not found"));

            // Calculate price based on duration securely on backend
            BigDecimal price;
            if (request.getDurationDays() == 7) {
                price = subscription.getPrice7();
            } else if (request.getDurationDays() == 15) {
                price = subscription.getPrice15();
            } else if (request.getDurationDays() == 30) {
                price = subscription.getPrice30();
            } else {
                return ResponseEntity.badRequest().body("Invalid duration. Must be 7, 15, or 30 days.");
            }

            System.out.println("Processing order for: " + email);
            System.out.println("Request Coords: Lat=" + request.getLatitude() + ", Lng=" + request.getLongitude());

            Order order = new Order();
            order.setUser(user); // Ensure user is set first
            order.setSubscription(subscription);
            order.setDuration(request.getDurationDays());
            order.setAmount(price); // Use server-calculated price
            order.setOrderDate(java.time.LocalDateTime.now());
            order.setStatus(Order.OrderStatus.PENDING);
            order.setPaymentStatus("PENDING");
            order.setAddressLine(request.getAddressLine());
            order.setCity(request.getCity());
            order.setState(request.getState());
            order.setPincode(request.getPincode());
            order.setLatitude(request.getLatitude());
            order.setLongitude(request.getLongitude());

            if (request.getStartDate() != null) {
                try {
                    // Try parsing ISO date-time or date
                    java.time.LocalDateTime start;
                    if (request.getStartDate().contains("T")) {
                        start = java.time.LocalDateTime.parse(request.getStartDate());
                    } else {
                        start = java.time.LocalDate.parse(request.getStartDate()).atStartOfDay();
                    }
                    order.setStartDate(start);
                    order.setEndDate(start.plusDays(request.getDurationDays()));
                } catch (Exception e) {
                    // Fallback to now if parsing fails
                    order.setStartDate(java.time.LocalDateTime.now());
                    order.setEndDate(java.time.LocalDateTime.now().plusDays(request.getDurationDays()));
                }
            }

            return ResponseEntity.ok(orderRepository.save(order));
        } catch (Exception e) {
            e.printStackTrace(); // Log the error
            return ResponseEntity.status(500).body("Error creating order: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders(
            @RequestHeader(value = "Authorization", required = false) String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.status(401).build();
        }
        try {
            return ResponseEntity.ok(orderRepository.findAll());
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyOrders(
            @RequestHeader(value = "Authorization", required = false) String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body("No token provided");
        }
        try {
            String email = jwtUtil.getEmailFromToken(token.replace("Bearer ", ""));
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<Order> orders = orderRepository.findByUser(user);
            System.out.println("Found " + orders.size() + " orders for user: " + email);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/vendor")
    public ResponseEntity<List<Order>> getVendorOrders(
            @RequestHeader(value = "Authorization", required = false) String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.status(401).build();
        }
        try {
            String email = jwtUtil.getEmailFromToken(token.replace("Bearer ", ""));
            User vendor = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            List<Order> orders = orderRepository.findByVendor(vendor);
            System.out.println("Vendor: " + email + " fetched " + orders.size() + " orders.");
            for (Order o : orders) {
                System.out.println(
                        "Order ID: " + o.getId() + " - Lat: " + o.getLatitude() + ", Lng: " + o.getLongitude());
            }
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    public static class OrderRequest {
        private Long subscriptionId;
        private Integer durationDays;
        private String startDate;
        private String addressLine;
        private String city;
        private String state;
        private String pincode;
        private Double latitude;
        private Double longitude;
        private Double price;

        public Long getSubscriptionId() {
            return subscriptionId;
        }

        public void setSubscriptionId(Long subscriptionId) {
            this.subscriptionId = subscriptionId;
        }

        public Integer getDurationDays() {
            return durationDays;
        }

        public void setDurationDays(Integer durationDays) {
            this.durationDays = durationDays;
        }

        public String getStartDate() {
            return startDate;
        }

        public void setStartDate(String startDate) {
            this.startDate = startDate;
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

        public Double getLatitude() {
            return latitude;
        }

        public void setLatitude(Double latitude) {
            this.latitude = latitude;
        }

        public Double getLongitude() {
            return longitude;
        }

        public void setLongitude(Double longitude) {
            this.longitude = longitude;
        }

        public Double getPrice() {
            return price;
        }

        public void setPrice(Double price) {
            this.price = price;
        }
    }
}