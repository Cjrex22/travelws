package com.wandrr.modules.packages;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TripPackageService {
    
    private final TripPackageRepository tripPackageRepository;
    
    public List<TripPackage> getAllPackages() {
        return tripPackageRepository.findAll();
    }
    
    public List<TripPackage> getFeaturedPackages() {
        return tripPackageRepository.findByIsFeaturedTrue();
    }
    
    public TripPackage getPackageById(UUID id) {
        return tripPackageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Package not found"));
    }
}
