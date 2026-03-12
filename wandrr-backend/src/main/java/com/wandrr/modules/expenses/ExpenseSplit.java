package com.wandrr.modules.expenses;

import com.wandrr.modules.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "expense_splits")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseSplit {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "expense_id", nullable = false)
    private Expense expense;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "split_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal splitAmount;

    @Column(name = "is_settled")
    @Builder.Default
    private boolean isSettled = false;

    @Column(name = "settled_at")
    private LocalDateTime settledAt;
}
