package com.wandrr.modules.trips;

import com.wandrr.exception.ResourceNotFoundException;
import com.wandrr.exception.UnauthorizedException;
import com.wandrr.modules.trips.dto.CreateTripRequest;
import com.wandrr.modules.trips.dto.TripDetailDTO;
import com.wandrr.modules.user.User;
import com.wandrr.modules.user.UserRepository;
import com.wandrr.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class TripService {

    private final TripRepository tripRepository;
    private final TripMemberRepository tripMemberRepository;
    private final UserRepository userRepository;

    public ApiResponse<TripDetailDTO> createTrip(String creatorEmail, CreateTripRequest request) {
        User creator = userRepository.findByEmail(creatorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        Trip trip = Trip.builder()
                .name(request.name())
                .description(request.description())
                .createdBy(creator)
                .startDate(request.startDate())
                .endDate(request.endDate())
                .status(Trip.TripStatus.PLANNING)
                .build();
        trip = tripRepository.save(trip);

        // Add creator as ADMIN member
        addMemberToTrip(trip, creator, TripMember.Role.ADMIN);

        // Add additional members
        if (request.memberIds() != null) {
            for (UUID memberId : request.memberIds()) {
                User member = userRepository.findById(memberId)
                        .orElseThrow(() -> new ResourceNotFoundException("User not found: " + memberId));
                addMemberToTrip(trip, member, TripMember.Role.MEMBER);
            }
        }

        // Reload to get members
        trip = tripRepository.findById(trip.getId()).orElseThrow();
        log.info("Trip created: {} by {}", trip.getName(), creatorEmail);
        return ApiResponse.success("Trip created successfully.", TripDetailDTO.from(trip));
    }

    @Transactional(readOnly = true)
    public List<TripDetailDTO> getTripsForUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));
        return tripRepository.findAllByMemberUserId(user.getId())
                .stream().map(TripDetailDTO::from).toList();
    }

    @Transactional(readOnly = true)
    public List<TripDetailDTO> getUpcomingTrips(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));
        return tripRepository.findUpcomingByMemberUserId(user.getId())
                .stream().map(TripDetailDTO::from).toList();
    }

    @Transactional(readOnly = true)
    public TripDetailDTO getTripById(UUID tripId, String requesterEmail) {
        User requester = userRepository.findByEmail(requesterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found."));

        boolean isMember = tripMemberRepository.existsByTripIdAndUserId(tripId, requester.getId());
        if (!isMember)
            throw new UnauthorizedException("You are not a member of this trip.");

        return TripDetailDTO.from(trip);
    }

    public ApiResponse<TripDetailDTO> updateTrip(UUID tripId, String requesterEmail,
            CreateTripRequest request) {
        validateTripAdmin(tripId, requesterEmail);
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found."));

        if (request.name() != null)
            trip.setName(request.name());
        if (request.description() != null)
            trip.setDescription(request.description());
        if (request.startDate() != null)
            trip.setStartDate(request.startDate());
        if (request.endDate() != null)
            trip.setEndDate(request.endDate());

        trip = tripRepository.save(trip);
        return ApiResponse.success("Trip updated.", TripDetailDTO.from(trip));
    }

    public ApiResponse<Void> deleteTrip(UUID tripId, String requesterEmail) {
        validateTripAdmin(tripId, requesterEmail);
        tripRepository.deleteById(tripId);
        return ApiResponse.success("Trip deleted.", null);
    }

    public ApiResponse<Void> addMember(UUID tripId, UUID newUserId, String requesterEmail) {
        validateTripAdmin(tripId, requesterEmail);
        User newUser = userRepository.findById(newUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found."));
        addMemberToTrip(trip, newUser, TripMember.Role.MEMBER);
        return ApiResponse.success(newUser.getFullName() + " added to trip.", null);
    }

    public ApiResponse<Void> removeMember(UUID tripId, UUID userId, String requesterEmail) {
        validateTripAdmin(tripId, requesterEmail);
        tripMemberRepository.deleteByTripIdAndUserId(tripId, userId);
        return ApiResponse.success("Member removed.", null);
    }

    public ApiResponse<Void> bulkAddMembers(UUID tripId, List<UUID> userIds, String requesterEmail) {
        validateTripAdmin(tripId, requesterEmail);
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found."));
        for (UUID userId : userIds) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
            addMemberToTrip(trip, user, TripMember.Role.MEMBER);
        }
        return ApiResponse.success(userIds.size() + " members added.", null);
    }

    public ApiResponse<Void> updateDescription(UUID tripId, String description, String requesterEmail) {
        User requester = userRepository.findByEmail(requesterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));
        if (!tripMemberRepository.existsByTripIdAndUserId(tripId, requester.getId())) {
            throw new UnauthorizedException("You are not a member of this trip.");
        }
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found."));
        trip.setDescription(description);
        tripRepository.save(trip);
        return ApiResponse.success("Description updated.", null);
    }

    private void addMemberToTrip(Trip trip, User user, TripMember.Role role) {
        if (!tripMemberRepository.existsByTripIdAndUserId(trip.getId(), user.getId())) {
            TripMember member = TripMember.builder()
                    .trip(trip).user(user).role(role).build();
            tripMemberRepository.save(member);
        }
    }

    private void validateTripAdmin(UUID tripId, String requesterEmail) {
        User requester = userRepository.findByEmail(requesterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));
        TripMember membership = tripMemberRepository
                .findByTripIdAndUserId(tripId, requester.getId())
                .orElseThrow(() -> new UnauthorizedException("Not a trip member."));
        if (membership.getRole() != TripMember.Role.ADMIN) {
            throw new UnauthorizedException("Only trip admins can perform this action.");
        }
    }
}
