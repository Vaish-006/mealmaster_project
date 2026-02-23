package com.mealmaster.backend.controller;

import com.mealmaster.backend.dto.PaymentRequest;
import com.mealmaster.backend.entity.Order;
import com.mealmaster.backend.repository.OrderRepository;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.ByteArrayOutputStream;
import java.util.Map;
import java.util.Optional;
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ContentDisposition;
import java.awt.Color;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private OrderRepository orderRepository;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    @PostMapping("/orders/{id}/create-payment")
    public ResponseEntity<?> createPayment(@PathVariable Long id) {
        System.out.println("Processing payment request for order ID: " + id);
        try {
            Optional<Order> orderOpt = orderRepository.findById(id);
            if (!orderOpt.isPresent()) {
                System.out.println("Order not found: " + id);
                return ResponseEntity.badRequest().body(Map.of("error", "Order not found"));
            }

            Order order = orderOpt.get();
            System.out.println("Order amount: " + order.getAmount());
            System.out.println("Using Razorpay Key: " + razorpayKeyId);

            RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            org.json.JSONObject orderRequest = new org.json.JSONObject();
            orderRequest.put("amount", order.getAmount().multiply(new java.math.BigDecimal("100")).intValue());
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "order_" + order.getId());

            com.razorpay.Order razorpayOrder = razorpay.orders.create(orderRequest);

            order.setRazorpayOrderId(razorpayOrder.get("id"));
            orderRepository.save(order);

            Map<String, Object> response = new java.util.HashMap<>();
            response.put("orderId", razorpayOrder.get("id"));
            response.put("amount", razorpayOrder.get("amount"));
            response.put("currency", razorpayOrder.get("currency"));
            response.put("keyId", razorpayKeyId);

            return ResponseEntity.ok(response);
        } catch (RazorpayException e) {
            System.err.println("RazorpayException: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Payment creation failed: " + e.getMessage()));
        } catch (Exception e) {
            System.err.println("Exception: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Server error: " + e.getMessage()));
        }
    }

    @PostMapping("/orders/{id}/verify-payment")
    public ResponseEntity<?> verifyPayment(@PathVariable Long id, @RequestBody PaymentRequest paymentRequest) {
        try {
            Optional<Order> orderOpt = orderRepository.findById(id);
            if (!orderOpt.isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Order not found"));
            }

            Order order = orderOpt.get();

            // Verify signature
            String generatedSignature = generateSignature(paymentRequest.getRazorpayOrderId(),
                    paymentRequest.getRazorpayPaymentId(),
                    razorpayKeySecret);

            if (generatedSignature.equals(paymentRequest.getRazorpaySignature())) {
                order.setRazorpayPaymentId(paymentRequest.getRazorpayPaymentId());
                order.setPaymentStatus("COMPLETED");
                order.setStatus(Order.OrderStatus.CONFIRMED);
                orderRepository.save(order);

                return ResponseEntity.ok(Map.of(
                        "status", "success",
                        "message", "Payment verified successfully",
                        "orderId", order.getId(),
                        "paymentId", paymentRequest.getRazorpayPaymentId()));
            } else {
                order.setPaymentStatus("FAILED");
                orderRepository.save(order);
                return ResponseEntity.badRequest().body(Map.of("error", "Payment verification failed"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Payment verification failed: " + e.getMessage()));
        }
    }

    private String generateSignature(String orderId, String paymentId, String secret) {
        try {
            String payload = orderId + "|" + paymentId;
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(secret.getBytes(), "HmacSHA256");
            mac.init(secretKeySpec);
            byte[] hash = mac.doFinal(payload.getBytes());

            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error generating signature", e);
        }
    }

    @GetMapping("/orders/{id}/receipt")
    public ResponseEntity<byte[]> downloadReceipt(@PathVariable Long id) {
        System.out.println("Generating receipt for order ID: " + id);
        Optional<Order> orderOpt = orderRepository.findById(id);
        if (!orderOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Order order = orderOpt.get();
        // Allow downloading if status is CONFIRMED or payment is COMPLETED
        if (!"COMPLETED".equals(order.getPaymentStatus()) && order.getStatus() != Order.OrderStatus.CONFIRMED) {
            System.err.println("Order payment not completed for ID: " + id);
            return ResponseEntity.badRequest().build();
        }

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, out);

            document.open();

            // Font styles
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, Color.DARK_GRAY);
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.BLACK);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 12, Color.BLACK);
            Font footerFont = FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 10, Color.GRAY);

            // Title
            Paragraph title = new Paragraph("MEALMASTER", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            Paragraph subTitle = new Paragraph("Official Payment Receipt",
                    FontFactory.getFont(FontFactory.HELVETICA, 14, Color.GRAY));
            subTitle.setAlignment(Element.ALIGN_CENTER);
            subTitle.setSpacingAfter(30);
            document.add(subTitle);

            // Order Details Table
            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);
            table.setSpacingBefore(10f);
            table.setSpacingAfter(10f);
            table.setWidths(new float[] { 1, 2 });

            addRow(table, "Order ID", String.valueOf(order.getId()), headerFont, normalFont);
            addRow(table, "Payment ID", order.getRazorpayPaymentId(), headerFont, normalFont);
            addRow(table, "Subscription", order.getSubscription() != null ? order.getSubscription().getName() : "N/A",
                    headerFont, normalFont);
            addRow(table, "Plan Type",
                    order.getSubscription() != null ? order.getSubscription().getPlanType().toString() : "N/A",
                    headerFont, normalFont);
            addRow(table, "Duration", order.getDuration() + " Days", headerFont, normalFont);
            addRow(table, "Amount Paid", "INR " + order.getAmount(), headerFont, normalFont);
            addRow(table, "Order Date",
                    order.getOrderDate() != null ? order.getOrderDate().toString().split("T")[0] : "N/A", headerFont,
                    normalFont);
            addRow(table, "Start Date",
                    order.getStartDate() != null ? order.getStartDate().toString().split("T")[0] : "N/A", headerFont,
                    normalFont);
            addRow(table, "End Date", order.getEndDate() != null ? order.getEndDate().toString().split("T")[0] : "N/A",
                    headerFont, normalFont);

            document.add(table);

            // Delivery Address
            document.add(new Paragraph("Delivery Address:", headerFont));
            String address = order.getDeliveryAddress();
            document.add(new Paragraph(address != null ? address : "N/A", normalFont));

            // Footer
            Paragraph footer = new Paragraph("\n\nThank you for choosing MealMaster! Visit us again.", footerFont);
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();

            byte[] pdfBytes = out.toByteArray();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(ContentDisposition.attachment()
                    .filename("receipt_" + order.getId() + ".pdf")
                    .build());
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

            return ResponseEntity.ok()
                    .headers(headers)
                    .contentLength(pdfBytes.length)
                    .body(pdfBytes);

        } catch (Exception e) {
            System.err.println("Error generating PDF: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    private void addRow(PdfPTable table, String label, String value, Font labelFont, Font valueFont) {
        PdfPCell c1 = new PdfPCell(new Phrase(label, labelFont));
        c1.setPadding(8);
        c1.setBackgroundColor(new Color(240, 240, 240));
        table.addCell(c1);

        PdfPCell c2 = new PdfPCell(new Phrase(value != null ? value : "N/A", valueFont));
        c2.setPadding(8);
        table.addCell(c2);
    }
}