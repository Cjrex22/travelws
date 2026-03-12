package com.wandrr.modules.itinerary.dto;

import lombok.Data;

@Data
public class GenerateItineraryRequest {
    private String destination;
    private int numDays;
    private String travelStyle;
    private String budget;
}
