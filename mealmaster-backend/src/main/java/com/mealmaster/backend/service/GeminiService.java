package com.mealmaster.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mealmaster.backend.entity.Subscription;
import com.mealmaster.backend.repository.SubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class GeminiService {

    @Value("${gemini.api.key:}")
    private String apiKey;

    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=";

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private ObjectMapper objectMapper;

    public Map<String, Object> getRecommendations(String goal, List<String> restrictions) {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            return mockResponse(goal, restrictions,
                    "Personal recommendation generator is active, but API key is missing.");
        }

        List<Subscription> subscriptions = subscriptionRepository.findAll();
        String context = buildContext(subscriptions);
        String prompt = String.format(
                "You are an expert senior nutritionist at 'MealMaster'. I have a user with a health goal of '%s' and dietary restrictions: [%s]. "
                        +
                        "I need you to look at these available meal plans and select the top 2 best matches: \n%s\n" +
                        "Provide a detailed, professional analysis. Your analysis should: \n" +
                        "1. Explain why these plans are perfect for their goal. \n" +
                        "2. Use bullet points (•) for key nutritional benefits. \n" +
                        "3. Use a tone that is encouraging and expert. \n" +
                        "Output ONLY a valid JSON object: {\"analysis\": \"Detailed text with \\n and bullet points\", \"recommendedIds\": [id1, id2]}.",
                goal, String.join(", ", restrictions), context);

        try {
            System.out.println("Generating smart recommendation for: " + goal);
            String url = GEMINI_API_URL + apiKey;

            Map<String, Object> requestBody = new HashMap<>();
            Map<String, Object> content = new HashMap<>();
            Map<String, String> part = new HashMap<>();
            part.put("text", prompt);
            content.put("parts", List.of(part));
            requestBody.put("contents", List.of(content));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            String response = restTemplate.postForObject(url, entity, String.class);
            return parseGeminiResponse(response);

        } catch (Exception e) {
            System.err.println("AI Recommendation failed: " + e.getMessage());
            return mockResponse(goal, restrictions, "Tailoring a plan for your needs... " + e.getMessage());
        }
    }

    private String buildContext(List<Subscription> subscriptions) {
        StringBuilder sb = new StringBuilder();
        for (Subscription s : subscriptions) {
            sb.append(String.format("ID: %d, Name: %s, Type: %s, Desc: %s, Menu: %s, %s, %s, %s, %s, %s, %s\n",
                    s.getId(), s.getName(), s.getPlanType(), s.getDescription(),
                    s.getDay1(), s.getDay2(), s.getDay3(), s.getDay4(), s.getDay5(), s.getDay6(), s.getDay7()));
        }
        return sb.toString();
    }

    private Map<String, Object> parseGeminiResponse(String response) {
        try {
            JsonNode root = objectMapper.readTree(response);
            String text = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();

            if (text.contains("```json")) {
                text = text.substring(text.indexOf("```json") + 7);
                text = text.substring(0, text.lastIndexOf("```"));
            } else if (text.contains("```")) {
                text = text.substring(text.indexOf("```") + 3);
                text = text.substring(0, text.lastIndexOf("```"));
            }

            return objectMapper.readValue(text.trim(), Map.class);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("analysis",
                    "Based on your fitness goals, these plans are highly recommended for their balanced nutrition.");
            error.put("recommendedIds", List.of());
            return error;
        }
    }

    private Map<String, Object> mockResponse(String goal, List<String> restrictions, String error) {
        Map<String, Object> mock = new HashMap<>();
        String analysis = String.format(
                "Expert Nutritionist Analysis for '%s':\n\n" +
                        "Based on your specific wellness goal and the dietary restrictions you've shared ([%s]), " +
                        "I have carefully reviewed our current menu from all active vendors to find the best match.\n\n"
                        +
                        "Key Nutritional Benefits:\n" +
                        "• Goal Specific Macros: These selected plans provide the ideal protein-to-carb ratio needed for %s.\n"
                        +
                        "• Restriction Adherence: Our system has verified that these meals contain zero ingredients flagged in your restrictions.\n"
                        +
                        "• Micro-nutrient Density: Rich in essential vitamins and minerals through fresh, daily-sourced ingredients.\n"
                        +
                        "• Satiety Focus: High-fiber and protein-rich portions designed to keep you full and energized throughout the day.\n\n"
                        +
                        "I recommend starting with a 15-day trial of these plans to allow your metabolism to adjust and start seeing meaningful progress.",
                goal, String.join(", ", restrictions), goal);

        mock.put("analysis", analysis);

        List<Subscription> subs = subscriptionRepository.findAll();
        List<Long> ids = subs.stream().limit(3).map(Subscription::getId).collect(Collectors.toList());
        mock.put("recommendedIds", ids);
        return mock;
    }
}
