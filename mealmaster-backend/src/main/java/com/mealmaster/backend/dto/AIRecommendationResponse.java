package com.mealmaster.backend.dto;

import java.util.List;

public class AIRecommendationResponse {
    private String analysis;
    private List<Long> recommendedSubscriptionIds;

    public String getAnalysis() {
        return analysis;
    }

    public void setAnalysis(String analysis) {
        this.analysis = analysis;
    }

    public List<Long> getRecommendedSubscriptionIds() {
        return recommendedSubscriptionIds;
    }

    public void setRecommendedSubscriptionIds(List<Long> recommendedSubscriptionIds) {
        this.recommendedSubscriptionIds = recommendedSubscriptionIds;
    }
}
