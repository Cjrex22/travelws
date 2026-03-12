package com.wandrr.modules.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    @Query("""
                SELECT u FROM User u
                WHERE (LOWER(u.username) LIKE LOWER(CONCAT('%', :query, '%'))
                    OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :query, '%')))
                AND u.email <> :excludeEmail
                AND u.id NOT IN (
                    SELECT tm.user.id FROM TripMember tm WHERE tm.trip.id = :tripId
                )
            """)
    List<User> searchUsersExcludingTripMembers(
            @Param("query") String query,
            @Param("excludeEmail") String excludeEmail,
            @Param("tripId") UUID tripId);

    @Query("""
                SELECT u FROM User u
                WHERE (LOWER(u.username) LIKE LOWER(CONCAT('%', :query, '%'))
                    OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :query, '%')))
                AND u.email <> :excludeEmail
            """)
    List<User> searchUsers(
            @Param("query") String query,
            @Param("excludeEmail") String excludeEmail);
}
