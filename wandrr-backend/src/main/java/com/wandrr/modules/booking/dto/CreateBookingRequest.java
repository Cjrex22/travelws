package com.wandrr.modules.booking.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
public class CreateBookingRequest {
    private UUID packageId;
    private LocalDate travelDate;
    private int totalPersons;
    private List<UUID> buddyIds;
}
