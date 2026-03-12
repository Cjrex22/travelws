package com.wandrr.modules.expenses;

import com.wandrr.modules.expenses.dto.BreakdownDTO.SettlementTransaction;
import com.wandrr.modules.expenses.dto.MemberBalanceDTO;
import com.wandrr.modules.user.User;
import com.wandrr.modules.user.dto.UserProfileDTO;
import jakarta.validation.ValidationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class SplitCalculatorService {

    /**
     * Splits total_amount equally among all participants.
     * Handles rounding by adding remainder to the first split.
     * Payer's own split is auto-marked settled if includeSelf=true.
     */
    public List<ExpenseSplit> calculateSplits(
            Expense expense,
            User payer,
            List<User> splitAmong,
            boolean includeSelf) {

        List<User> participants = new ArrayList<>(splitAmong);
        if (includeSelf && participants.stream().noneMatch(u -> u.getId().equals(payer.getId()))) {
            participants.add(0, payer);
        }

        int count = participants.size();
        if (count == 0)
            throw new ValidationException("At least one participant is required.");

        BigDecimal total = expense.getTotalAmount();
        BigDecimal perPerson = total.divide(BigDecimal.valueOf(count), 2, RoundingMode.HALF_UP);

        BigDecimal distributed = perPerson.multiply(BigDecimal.valueOf(count));
        BigDecimal remainder = total.subtract(distributed);

        List<ExpenseSplit> splits = new ArrayList<>();
        for (int i = 0; i < participants.size(); i++) {
            User participant = participants.get(i);

            BigDecimal share = (i == 0) ? perPerson.add(remainder) : perPerson;
            boolean autoSettled = participant.getId().equals(payer.getId());

            splits.add(ExpenseSplit.builder()
                    .expense(expense)
                    .user(participant)
                    .splitAmount(share)
                    .isSettled(autoSettled)
                    .settledAt(autoSettled ? LocalDateTime.now() : null)
                    .build());
        }

        log.info("Split {} among {} people. Per person: {}. Remainder: {}",
                total, count, perPerson, remainder);
        return splits;
    }

    /**
     * Greedy debt settlement algorithm — minimises number of transactions.
     */
    public List<SettlementTransaction> calculateSettlements(List<MemberBalanceDTO> memberBalances) {
        List<MemberBalanceDTO> creditors = memberBalances.stream()
                .filter(m -> m.getNetBalance().compareTo(BigDecimal.ZERO) > 0)
                .sorted((a, b) -> b.getNetBalance().compareTo(a.getNetBalance()))
                .collect(Collectors.toCollection(ArrayList::new));

        List<MemberBalanceDTO> debtors = memberBalances.stream()
                .filter(m -> m.getNetBalance().compareTo(BigDecimal.ZERO) < 0)
                .sorted(Comparator.comparing(MemberBalanceDTO::getNetBalance))
                .collect(Collectors.toCollection(ArrayList::new));

        List<SettlementTransaction> transactions = new ArrayList<>();
        int i = 0, j = 0;

        while (i < creditors.size() && j < debtors.size()) {
            BigDecimal credit = creditors.get(i).getNetBalance();
            BigDecimal debt = debtors.get(j).getNetBalance().abs();
            BigDecimal amount = credit.min(debt);

            transactions.add(SettlementTransaction.builder()
                    .from(debtors.get(j).getUser())
                    .to(creditors.get(i).getUser())
                    .amount(amount.setScale(2, RoundingMode.HALF_UP))
                    .build());

            creditors.get(i).setNetBalance(credit.subtract(amount));
            debtors.get(j).setNetBalance(debtors.get(j).getNetBalance().add(amount));

            if (creditors.get(i).getNetBalance().compareTo(BigDecimal.ZERO) == 0)
                i++;
            if (debtors.get(j).getNetBalance().compareTo(BigDecimal.ZERO) == 0)
                j++;
        }

        return transactions;
    }
}
