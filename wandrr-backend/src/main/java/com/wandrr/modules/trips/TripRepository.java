package com.wandrr.modules.trips;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TripRepository extends JpaRepository<Trip, UUID> {

    @Query("""
                SELECT t FROM Trip t
                JOIN t.members m
                WHERE m.user.id = :userId
                ORDER BY t.createdAt DESC
            """)
    List<Trip> findAllByMemberUserId(@Param("userId") UUID userId);

    @Query("""
                SELECT t FROM Trip t
                JOIN t.members m
                WHERE m.user.id = :userId
                AND t.status IN ('PLANNING', 'CONFIRMED')
                AND (t.startDate >= CURRENT_DATE OR t.startDate IS NULL)
                ORDER BY t.startDate ASC NULLS LAST
            """)
    List<Trip> findUpcomingByMemberUserId(@Param("userId") UUID userId);

    @Query("""
                SELECT COUNT(DISTINCT t.id) FROM Trip t
                JOIN t.members m
                WHERE m.user.id = :userId
            """)
    long countTotalTripsByUserId(@Param("userId") UUID userId);

    @Query("""
                SELECT COUNT(DISTINCT t.id) FROM Trip t
                JOIN t.members m
                WHERE m.user.id = :userId
                AND (t.status = 'PLANNING' OR t.startDate > CURRENT_DATE)
            """)
    long countUpcomingTripsByUserId(@Param("userId") UUID userId);
}
