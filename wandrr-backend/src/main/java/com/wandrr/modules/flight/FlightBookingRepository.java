package com.wandrr.modules.flight;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface FlightBookingRepository extends JpaRepository<FlightBooking, UUID> {
    List<FlightBooking> findByUserIdOrderByCreatedAtDesc(UUID userId);
}
