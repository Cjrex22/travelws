package com.wandrr.modules.trips;

import com.wandrr.modules.trips.dto.CreateTripRequest;
import com.wandrr.modules.trips.dto.TripDetailDTO;
import com.wandrr.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TripDetailDTO>>> getTrips(
            @RequestParam(required = false) String status,
            @AuthenticationPrincipal UserDetails principal) {
        List<TripDetailDTO> trips;
        if ("upcoming".equalsIgnoreCase(status)) {
            trips = tripService.getUpcomingTrips(principal.getUsername());
        } else {
            trips = tripService.getTripsForUser(principal.getUsername());
        }
        return ResponseEntity.ok(ApiResponse.success("Trips retrieved.", trips));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TripDetailDTO>> createTrip(
            @Valid @RequestBody CreateTripRequest request,
            @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(tripService.createTrip(principal.getUsername(), request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TripDetailDTO>> getTripById(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(
                ApiResponse.success("Trip retrieved.", tripService.getTripById(id, principal.getUsername())));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TripDetailDTO>> updateTrip(
            @PathVariable UUID id,
            @Valid @RequestBody CreateTripRequest request,
            @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(tripService.updateTrip(id, principal.getUsername(), request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTrip(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(tripService.deleteTrip(id, principal.getUsername()));
    }

    @PostMapping("/{id}/members")
    public ResponseEntity<ApiResponse<Void>> addMember(
            @PathVariable UUID id,
            @RequestBody UUID userId,
            @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(tripService.addMember(id, userId, principal.getUsername()));
    }

    @DeleteMapping("/{id}/members/{userId}")
    public ResponseEntity<ApiResponse<Void>> removeMember(
            @PathVariable UUID id,
            @PathVariable UUID userId,
            @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(tripService.removeMember(id, userId, principal.getUsername()));
    }

    @PostMapping("/{id}/members/bulk")
    public ResponseEntity<ApiResponse<Void>> bulkAddMembers(
            @PathVariable UUID id,
            @RequestBody List<UUID> userIds,
            @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(tripService.bulkAddMembers(id, userIds, principal.getUsername()));
    }

    @PutMapping("/{id}/description")
    public ResponseEntity<ApiResponse<Void>> updateDescription(
            @PathVariable UUID id,
            @RequestBody java.util.Map<String, String> body,
            @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(tripService.updateDescription(id, body.get("description"), principal.getUsername()));
    }
}
