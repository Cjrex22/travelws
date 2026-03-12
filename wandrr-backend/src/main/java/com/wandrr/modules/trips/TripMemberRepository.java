package com.wandrr.modules.trips;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TripMemberRepository extends JpaRepository<TripMember, UUID> {

    boolean existsByTripIdAndUserId(UUID tripId, UUID userId);

    Optional<TripMember> findByTripIdAndUserId(UUID tripId, UUID userId);

    void deleteByTripIdAndUserId(UUID tripId, UUID userId);
}
