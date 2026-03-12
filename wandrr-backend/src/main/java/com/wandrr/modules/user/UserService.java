package com.wandrr.modules.user;

import com.wandrr.exception.ResourceNotFoundException;
import com.wandrr.modules.buddies.UserBuddyRepository;
import com.wandrr.modules.trips.TripRepository;
import com.wandrr.modules.user.dto.UserProfileDTO;
import com.wandrr.modules.user.dto.UserSearchResultDTO;
import com.wandrr.modules.user.dto.UserStatsDTO;
import com.wandrr.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final TripRepository tripRepository;
    private final UserBuddyRepository buddyRepository;

    public User getUserEntityByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));
    }

    public User getUserEntityById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));
    }

    public ApiResponse<UserProfileDTO> getMyProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));
        return ApiResponse.success("Profile retrieved.", UserProfileDTO.from(user));
    }

    @Transactional(readOnly = true)
    public ApiResponse<UserStatsDTO> getStats(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        long totalTrips = tripRepository.countTotalTripsByUserId(user.getId());
        long buddies = buddyRepository.countByUserId(user.getId());
        long upcoming = tripRepository.countUpcomingTripsByUserId(user.getId());

        return ApiResponse.success("Stats retrieved.", UserStatsDTO.builder()
                .totalTrips(totalTrips)
                .buddies(buddies)
                .upcoming(upcoming)
                .build());
    }

    @Transactional
    public ApiResponse<UserProfileDTO> updateProfile(String email, String fullName,
            String bio, MultipartFile avatar) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        if (fullName != null && !fullName.isBlank()) {
            user.setFullName(fullName);
        }
        if (bio != null) {
            user.setBio(bio);
        }
        // Avatar upload would use CloudinaryService in production
        // For now, skip if no Cloudinary configured

        user = userRepository.save(user);
        return ApiResponse.success("Profile updated.", UserProfileDTO.from(user));
    }

    public ApiResponse<List<UserSearchResultDTO>> searchUsers(String query, UUID tripId,
            String excludeEmail) {
        List<User> users;
        if (tripId != null) {
            users = userRepository.searchUsersExcludingTripMembers(query, excludeEmail, tripId);
        } else {
            users = userRepository.searchUsers(query, excludeEmail);
        }
        List<UserSearchResultDTO> results = users.stream()
                .map(UserSearchResultDTO::from).toList();
        return ApiResponse.success("Search results.", results);
    }
}
