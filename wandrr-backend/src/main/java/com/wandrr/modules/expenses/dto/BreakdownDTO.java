package com.wandrr.modules.expenses.dto;

import com.wandrr.modules.user.dto.UserProfileDTO;
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
public class BreakdownDTO {
    private UUID tripId;
    private List<SettlementTransaction> settlements;
    private boolean allSettled;
    private int totalTransactionsNeeded;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SettlementTransaction {
        private UserProfileDTO from;
        private UserProfileDTO to;
        private BigDecimal amount;
    }
}
