package com.wandrr.modules.destination;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DestinationService {
    
    private final DestinationRepository destinationRepository;
    
    public Page<Destination> getAllDestinations(String category, Pageable pageable) {
        if (category != null && !category.equalsIgnoreCase("All")) {
            return destinationRepository.findByCategoryIgnoreCase(category, pageable);
        }
        return destinationRepository.findAll(pageable);
    }
    
    public List<Destination> getFeaturedDestinations() {
        return destinationRepository.findByIsFeaturedTrue();
    }
    
    public Destination getDestinationById(UUID id) {
        return destinationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Destination not found"));
    }
    
    public List<Destination> searchDestinations(String query) {
        return destinationRepository.findByNameContainingIgnoreCaseOrCountryContainingIgnoreCase(query, query);
    }
}
