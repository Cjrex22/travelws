package com.wandrr.modules.buddies;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserBuddyRepository extends JpaRepository<UserBuddy, UUID> {

    boolean existsByUserIdAndBuddyId(UUID userId, UUID buddyId);

    long countByUserId(UUID userId);

    List<UserBuddy> findAllByUserId(UUID userId);

    void deleteByUserIdAndBuddyId(UUID userId, UUID buddyId);
}
