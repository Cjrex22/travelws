package com.wandrr.modules.flight;

import com.wandrr.modules.flight.dto.CreateFlightBookingRequest;
import com.wandrr.modules.user.User;
import com.wandrr.modules.user.UserService;
import org.springframework.security.core.userdetails.UserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/flights")
@RequiredArgsConstructor
public class FlightController {

    private final FlightApiService flightApiService;
    private final FlightBookingRepository flightBookingRepository;
    private final UserService userService;

    @GetMapping("/search")
    public ResponseEntity<String> searchFlights(
            @RequestParam String from,
            @RequestParam String to,
            @RequestParam String date,
            @RequestParam int passengers,
            @RequestParam String travelClass) {
        
        String resultJson = flightApiService.searchFlights(from, to, date, passengers, travelClass);
        return ResponseEntity.ok()
                .header("Content-Type", "application/json")
                .body(resultJson);
    }

    @PostMapping("/book")
    public ResponseEntity<FlightBooking> bookFlight(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody CreateFlightBookingRequest request) {
        
        User user = userService.getUserEntityByEmail(userDetails.getUsername());
        
        // Generate a random PNR
        String pnr = "WNDR" + (int)(Math.random() * 90000 + 10000);
        
        FlightBooking booking = FlightBooking.builder()
                .user(user)
                .flightDataJson(request.getFlightDataJson())
                .passengerDetailsJson(request.getPassengerDetailsJson())
                .pnr(pnr)
                .totalCost(request.getTotalCost())
                .status("CONFIRMED")
                .departureDate(request.getDepartureDate())
                .fromCity(request.getFromCity())
                .toCity(request.getToCity())
                .build();
                
        return ResponseEntity.ok(flightBookingRepository.save(booking));
    }

    @GetMapping("/mine")
    public ResponseEntity<List<FlightBooking>> getMyFlightBookings(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserEntityByEmail(userDetails.getUsername());
        return ResponseEntity.ok(flightBookingRepository.findByUserIdOrderByCreatedAtDesc(user.getId()));
    }
}
