package com.mealmaster.backend.dto;

import java.util.List;

public class AIRecommendationRequest {
    private String goal;
    private List<String> restrictions;

    public String getGoal() {
        return goal;
    }

    public void setGoal(String goal) {
        this.goal = goal;
    }

    public List<String> getRestrictions() {
        return restrictions;
    }

    public void setRestrictions(List<String> restrictions) {
        this.restrictions = restrictions;
    }
}
