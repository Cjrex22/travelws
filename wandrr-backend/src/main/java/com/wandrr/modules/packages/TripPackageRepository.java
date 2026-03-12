package com.wandrr.modules.packages;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface TripPackageRepository extends JpaRepository<TripPackage, UUID> {
    List<TripPackage> findByIsFeaturedTrue();
    List<TripPackage> findByCategoryIgnoreCase(String category);
    List<TripPackage> findByDestinationContainingIgnoreCase(String destination);
    long count();
}
