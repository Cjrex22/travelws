package com.wandrr.modules.itinerary;

import com.wandrr.modules.itinerary.dto.GenerateItineraryRequest;
import com.wandrr.modules.itinerary.dto.SaveItineraryRequest;
import com.wandrr.modules.user.User;
import com.wandrr.modules.user.UserService;
import org.springframework.security.core.userdetails.UserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/itinerary")
@RequiredArgsConstructor
public class ItineraryController {

    private final AiItineraryService aiItineraryService;
    private final SavedItineraryRepository savedItineraryRepository;
    private final UserService userService;

    @PostMapping("/generate")
    public ResponseEntity<String> generateItinerary(@RequestBody GenerateItineraryRequest request) {
        String json = aiItineraryService.generateItinerary(
                request.getDestination(), 
                request.getNumDays(), 
                request.getTravelStyle(), 
                request.getBudget()
        );
        return ResponseEntity.ok()
                .header("Content-Type", "application/json")
                .body(json);
    }

    @PostMapping("/save")
    public ResponseEntity<SavedItinerary> saveItinerary(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody SaveItineraryRequest request) {
        
        User user = userService.getUserEntityByEmail(userDetails.getUsername());
        
        SavedItinerary saved = SavedItinerary.builder()
                .user(user)
                .destination(request.getDestination())
                .numDays(request.getNumDays())
                .travelStyle(request.getTravelStyle())
                .budget(request.getBudget())
                .itineraryJson(request.getItineraryJson())
                .build();
                
        return ResponseEntity.ok(savedItineraryRepository.save(saved));
    }

    @GetMapping("/mine")
    public ResponseEntity<List<SavedItinerary>> getMyItineraries(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserEntityByEmail(userDetails.getUsername());
        return ResponseEntity.ok(savedItineraryRepository.findByUserIdOrderByCreatedAtDesc(user.getId()));
    }
}
