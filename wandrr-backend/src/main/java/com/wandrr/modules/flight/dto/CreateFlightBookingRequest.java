package com.wandrr.modules.flight.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class CreateFlightBookingRequest {
    private String flightDataJson;
    private String passengerDetailsJson;
    private int totalCost;
    private LocalDate departureDate;
    private String fromCity;
    private String toCity;
}
