package com.wandrr.modules.buddies;

import com.wandrr.exception.ConflictException;
import com.wandrr.exception.ResourceNotFoundException;
import com.wandrr.modules.user.User;
import com.wandrr.modules.user.UserRepository;
import com.wandrr.modules.user.dto.UserSearchResultDTO;
import com.wandrr.util.ApiResponse;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class BuddyService {

    private final UserBuddyRepository buddyRepository;
    private final UserRepository userRepository;

    @Transactional
    public ApiResponse<BuddyAddResponse> addBuddy(String userEmail, UUID buddyUserId) {
        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        if (currentUser.getId().equals(buddyUserId)) {
            throw new ValidationException("You cannot add yourself as a buddy.");
        }

        if (buddyRepository.existsByUserIdAndBuddyId(currentUser.getId(), buddyUserId)) {
            throw new ConflictException("Already in your buddies list.");
        }

        User buddy = userRepository.findById(buddyUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        UserBuddy relationship = UserBuddy.builder()
                .userId(currentUser.getId())
                .buddyId(buddy.getId())
                .build();
        buddyRepository.save(relationship);

        long newCount = buddyRepository.countByUserId(currentUser.getId());
        log.info("Buddy added: {} -> {}", currentUser.getUsername(), buddy.getUsername());

        return ApiResponse.success("Buddy added!",
                new BuddyAddResponse(UserSearchResultDTO.from(buddy), newCount));
    }

    @Transactional(readOnly = true)
    public ApiResponse<List<UserSearchResultDTO>> getBuddies(String userEmail) {
        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        List<UserBuddy> buddyRelations = buddyRepository.findAllByUserId(currentUser.getId());
        List<UserSearchResultDTO> buddies = buddyRelations.stream()
                .map(ub -> userRepository.findById(ub.getBuddyId())
                        .map(UserSearchResultDTO::from)
                        .orElse(null))
                .filter(java.util.Objects::nonNull)
                .toList();

        return ApiResponse.success("Buddies retrieved.", buddies);
    }

    @Transactional
    public ApiResponse<Void> removeBuddy(String userEmail, UUID buddyId) {
        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        buddyRepository.deleteByUserIdAndBuddyId(currentUser.getId(), buddyId);
        return ApiResponse.success("Buddy removed.", null);
    }
}
