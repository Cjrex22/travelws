package com.wandrr.modules.expenses;

import com.wandrr.modules.expenses.dto.*;
import com.wandrr.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.UUID;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping
    public ResponseEntity<ApiResponse<Void>> addExpense(
            @Valid @RequestBody CreateExpenseRequest request,
            @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(expenseService.addExpense(principal.getUsername(), request));
    }

    @GetMapping("/summary/{tripId}")
    public ResponseEntity<ExpenseSummaryDTO> getSummary(
            @PathVariable UUID tripId,
            @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(expenseService.getSummary(tripId, principal.getUsername()));
    }

    @GetMapping("/breakdown/{tripId}")
    public ResponseEntity<BreakdownDTO> getBreakdown(
            @PathVariable UUID tripId,
            @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(expenseService.getFullBreakdown(tripId, principal.getUsername()));
    }

    @GetMapping("/user-balance")
    public ResponseEntity<ApiResponse<BigDecimal>> getUserBalance(
            @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(expenseService.getUserBalance(principal.getUsername()));
    }

    @PatchMapping("/splits/{id}/settle")
    public ResponseEntity<ApiResponse<Void>> markSettled(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(expenseService.markSettled(id, principal.getUsername()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteExpense(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(expenseService.deleteExpense(id, principal.getUsername()));
    }
}
