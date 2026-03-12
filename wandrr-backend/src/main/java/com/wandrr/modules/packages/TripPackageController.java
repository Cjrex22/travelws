package com.wandrr.modules.packages;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/packages")
@RequiredArgsConstructor
public class TripPackageController {

    private final TripPackageService tripPackageService;

    @GetMapping
    public ResponseEntity<List<TripPackage>> getAllPackages() {
        return ResponseEntity.ok(tripPackageService.getAllPackages());
    }

    @GetMapping("/featured")
    public ResponseEntity<List<TripPackage>> getFeaturedPackages() {
        return ResponseEntity.ok(tripPackageService.getFeaturedPackages());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TripPackage> getPackageById(@PathVariable UUID id) {
        return ResponseEntity.ok(tripPackageService.getPackageById(id));
    }
}
