package com.wandrr.modules.expenses;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ExpenseSplitRepository extends JpaRepository<ExpenseSplit, UUID> {

    List<ExpenseSplit> findByExpenseTripId(UUID tripId);

    List<ExpenseSplit> findByExpenseTripIdAndUserId(UUID tripId, UUID userId);
}
