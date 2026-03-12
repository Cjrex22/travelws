package com.wandrr.modules.trips.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record CreateTripRequest(
        @NotBlank @Size(max = 150) String name,
        @Size(max = 1000) String description,
        LocalDate startDate,
        LocalDate endDate,
        List<UUID> memberIds) {
}
