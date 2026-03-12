package com.wandrr.modules.destination;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/destinations")
@RequiredArgsConstructor
public class DestinationController {

    private final DestinationService destinationService;

    @GetMapping
    public ResponseEntity<Page<Destination>> getDestinations(
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(destinationService.getAllDestinations(category, PageRequest.of(page, size, Sort.by("name"))));
    }

    @GetMapping("/featured")
    public ResponseEntity<List<Destination>> getFeatured() {
        return ResponseEntity.ok(destinationService.getFeaturedDestinations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Destination> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(destinationService.getDestinationById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Destination>> search(@RequestParam String query) {
        return ResponseEntity.ok(destinationService.searchDestinations(query));
    }
}
