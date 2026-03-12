package com.wandrr.modules.destination;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface DestinationRepository extends JpaRepository<Destination, UUID> {
    Page<Destination> findByCategoryIgnoreCase(String category, Pageable pageable);
    List<Destination> findByIsFeaturedTrue();
    List<Destination> findByNameContainingIgnoreCaseOrCountryContainingIgnoreCase(String name, String country);
    long count();
}
