package com.wandrr.modules.user;

import com.wandrr.modules.user.dto.UserProfileDTO;
import com.wandrr.modules.user.dto.UserSearchResultDTO;
import com.wandrr.modules.user.dto.UserStatsDTO;
import com.wandrr.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileDTO>> getMyProfile(
            @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(userService.getMyProfile(principal.getUsername()));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<UserStatsDTO>> getStats(
            @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(userService.getStats(principal.getUsername()));
    }

    @PutMapping(value = "/me", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<UserProfileDTO>> updateProfile(
            @AuthenticationPrincipal UserDetails principal,
            @RequestPart(value = "fullName", required = false) String fullName,
            @RequestPart(value = "bio", required = false) String bio,
            @RequestPart(value = "avatar", required = false) MultipartFile avatar) {
        return ResponseEntity.ok(
                userService.updateProfile(principal.getUsername(), fullName, bio, avatar));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<UserSearchResultDTO>>> searchUsers(
            @RequestParam String q,
            @RequestParam(required = false) UUID tripId,
            @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(userService.searchUsers(q, tripId, principal.getUsername()));
    }
}
