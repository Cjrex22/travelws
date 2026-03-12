package com.wandrr.modules.expenses;

import com.wandrr.exception.ResourceNotFoundException;
import com.wandrr.exception.UnauthorizedException;
import com.wandrr.modules.expenses.dto.*;
import com.wandrr.modules.expenses.dto.BreakdownDTO.SettlementTransaction;
import com.wandrr.modules.trips.Trip;
import com.wandrr.modules.trips.TripMemberRepository;
import com.wandrr.modules.trips.TripRepository;
import com.wandrr.modules.user.User;
import com.wandrr.modules.user.UserRepository;
import com.wandrr.modules.user.dto.UserProfileDTO;
import com.wandrr.util.ApiResponse;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final ExpenseSplitRepository splitRepository;
    private final TripMemberRepository tripMemberRepository;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;
    private final SplitCalculatorService splitCalculator;

    public ApiResponse<Void> addExpense(String payerEmail, CreateExpenseRequest request) {
        User payer = userRepository.findByEmail(payerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        if (!tripMemberRepository.existsByTripIdAndUserId(request.tripId(), payer.getId())) {
            throw new UnauthorizedException("You are not a member of this trip.");
        }

        List<User> splitAmong = new ArrayList<>();
        for (UUID userId : request.splitAmong()) {
            User u = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
            if (!tripMemberRepository.existsByTripIdAndUserId(request.tripId(), u.getId())) {
                throw new ValidationException(u.getFullName() + " is not a member of this trip.");
            }
            splitAmong.add(u);
        }

        Trip trip = tripRepository.findById(request.tripId())
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found."));

        Expense expense = Expense.builder()
                .trip(trip)
                .title(request.title())
                .description(request.description())
                .totalAmount(request.totalAmount())
                .paidBy(payer)
                .includeSelf(request.includeSelf())
                .build();
        expense = expenseRepository.save(expense);

        List<ExpenseSplit> splits = splitCalculator.calculateSplits(
                expense, payer, splitAmong, request.includeSelf());
        splitRepository.saveAll(splits);

        return ApiResponse.success("Expense added successfully.", null);
    }

    @Transactional(readOnly = true)
    public ExpenseSummaryDTO getSummary(UUID tripId, String requesterEmail) {
        validateMembership(tripId, requesterEmail);

        BigDecimal total = expenseRepository.sumTotalByTripId(tripId);
        List<MemberBalanceDTO> balances = calculateMemberBalances(tripId);

        int memberCount = balances.size();
        BigDecimal perPersonAvg = memberCount > 0
                ? total.divide(BigDecimal.valueOf(memberCount), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        return ExpenseSummaryDTO.builder()
                .tripId(tripId)
                .totalExpenses(total)
                .memberCount(memberCount)
                .perPersonAverage(perPersonAvg)
                .members(balances)
                .build();
    }

    @Transactional(readOnly = true)
    public BreakdownDTO getFullBreakdown(UUID tripId, String requesterEmail) {
        validateMembership(tripId, requesterEmail);
        List<MemberBalanceDTO> balances = calculateMemberBalances(tripId);
        List<SettlementTransaction> settlements = splitCalculator.calculateSettlements(balances);

        return BreakdownDTO.builder()
                .tripId(tripId)
                .settlements(settlements)
                .allSettled(settlements.isEmpty())
                .totalTransactionsNeeded(settlements.size())
                .build();
    }

    @Transactional(readOnly = true)
    public ApiResponse<BigDecimal> getUserBalance(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        // Calculate net balance across all trips
        List<ExpenseSplit> allSplits = splitRepository.findAll();
        List<Expense> allExpenses = expenseRepository.findAll();

        BigDecimal totalPaid = allExpenses.stream()
                .filter(e -> e.getPaidBy().getId().equals(user.getId()))
                .map(Expense::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalOwed = allSplits.stream()
                .filter(s -> s.getUser().getId().equals(user.getId()) && !s.isSettled())
                .map(ExpenseSplit::getSplitAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal net = totalPaid.subtract(totalOwed);
        return ApiResponse.success("Balance retrieved.", net);
    }

    public ApiResponse<Void> markSettled(UUID splitId, String userEmail) {
        ExpenseSplit split = splitRepository.findById(splitId)
                .orElseThrow(() -> new ResourceNotFoundException("Split not found."));
        split.setSettled(true);
        split.setSettledAt(LocalDateTime.now());
        splitRepository.save(split);
        return ApiResponse.success("Expense marked as settled.", null);
    }

    public ApiResponse<Void> deleteExpense(UUID expenseId, String userEmail) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found."));
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        if (!expense.getPaidBy().getId().equals(user.getId())) {
            throw new UnauthorizedException("Only the payer can delete this expense.");
        }

        expenseRepository.delete(expense);
        return ApiResponse.success("Expense deleted.", null);
    }

    private List<MemberBalanceDTO> calculateMemberBalances(UUID tripId) {
        List<Expense> expenses = expenseRepository.findByTripIdOrderByCreatedAtDesc(tripId);
        List<ExpenseSplit> splits = splitRepository.findByExpenseTripId(tripId);

        Map<UUID, BigDecimal> totalPaidMap = new HashMap<>();
        Map<UUID, BigDecimal> totalOwedMap = new HashMap<>();
        Map<UUID, User> userMap = new HashMap<>();

        for (Expense expense : expenses) {
            UUID payerId = expense.getPaidBy().getId();
            totalPaidMap.merge(payerId, expense.getTotalAmount(), BigDecimal::add);
            userMap.putIfAbsent(payerId, expense.getPaidBy());
        }

        for (ExpenseSplit split : splits) {
            UUID userId = split.getUser().getId();
            totalOwedMap.merge(userId, split.getSplitAmount(), BigDecimal::add);
            userMap.putIfAbsent(userId, split.getUser());
        }

        return userMap.entrySet().stream()
                .map(entry -> {
                    UUID userId = entry.getKey();
                    BigDecimal paid = totalPaidMap.getOrDefault(userId, BigDecimal.ZERO);
                    BigDecimal owed = totalOwedMap.getOrDefault(userId, BigDecimal.ZERO);
                    return MemberBalanceDTO.builder()
                            .user(UserProfileDTO.from(entry.getValue()))
                            .totalPaid(paid)
                            .totalOwed(owed)
                            .netBalance(paid.subtract(owed))
                            .build();
                })
                .collect(Collectors.toList());
    }

    private void validateMembership(UUID tripId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));
        if (!tripMemberRepository.existsByTripIdAndUserId(tripId, user.getId())) {
            throw new UnauthorizedException("You are not a member of this trip.");
        }
    }
}
