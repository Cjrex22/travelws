package com.wandrr.modules.content;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ContentRepository extends JpaRepository<AppContent, UUID> {
    Optional<AppContent> findBySection(AppContent.Section section);
}
