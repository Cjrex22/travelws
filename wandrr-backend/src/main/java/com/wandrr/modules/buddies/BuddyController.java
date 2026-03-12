package com.wandrr.modules.buddies;

import com.wandrr.modules.user.dto.UserSearchResultDTO;
import com.wandrr.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/buddies")
@RequiredArgsConstructor
public class BuddyController {

    private final BuddyService buddyService;

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<BuddyAddResponse>> addBuddy(
            @RequestBody AddBuddyRequest request,
            @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(buddyService.addBuddy(principal.getUsername(), request.buddyUserId()));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserSearchResultDTO>>> getBuddies(
            @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(buddyService.getBuddies(principal.getUsername()));
    }

    @DeleteMapping("/{buddyId}")
    public ResponseEntity<ApiResponse<Void>> removeBuddy(
            @PathVariable UUID buddyId,
            @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(buddyService.removeBuddy(principal.getUsername(), buddyId));
    }
}
