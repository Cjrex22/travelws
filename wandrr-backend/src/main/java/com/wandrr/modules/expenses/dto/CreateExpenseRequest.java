package com.wandrr.modules.expenses.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record CreateExpenseRequest(
        @NotNull UUID tripId,
        @NotBlank @Size(max = 150) String title,
        String description,
        @NotNull @DecimalMin("0.01") BigDecimal totalAmount,
        @NotNull @Size(min = 1) List<UUID> splitAmong,
        boolean includeSelf) {
}
