package com.wandrr.modules.auth;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface OtpTokenRepository extends JpaRepository<OtpToken, UUID> {

    @Query("""
                SELECT o FROM OtpToken o
                WHERE o.user.id = :userId AND o.used = false
                ORDER BY o.createdAt DESC LIMIT 1
            """)
    Optional<OtpToken> findLatestUnusedForUser(@Param("userId") UUID userId);

    @Modifying
    @Query("UPDATE OtpToken o SET o.used = true WHERE o.user.id = :userId AND o.used = false")
    void invalidateAllForUser(@Param("userId") UUID userId);
}
