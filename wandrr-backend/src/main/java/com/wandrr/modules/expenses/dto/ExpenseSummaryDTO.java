package com.wandrr.modules.expenses.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseSummaryDTO {
    private UUID tripId;
    private BigDecimal totalExpenses;
    private int memberCount;
    private BigDecimal perPersonAverage;
    private List<MemberBalanceDTO> members;
}
