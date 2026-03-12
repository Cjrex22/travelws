package com.wandrr.modules.trips.dto;

import com.wandrr.modules.trips.Trip;
import com.wandrr.modules.user.dto.UserProfileDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TripDetailDTO {
        private UUID id;
        private String name;
        private String description;
        private String bannerUrl;
        private String status;
        private String currentTag;
        private LocalDate startDate;
        private LocalDate endDate;
        private UserProfileDTO createdBy;
        private List<MemberDTO> members;
        private String createdAt;

        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public static class MemberDTO {
                private UUID id;
                private String fullName;
                private String username;
                private String avatarUrl;
                private String role;
        }

        public static TripDetailDTO from(Trip trip) {
                List<MemberDTO> memberDTOs = trip.getMembers() != null
                                ? trip.getMembers().stream()
                                                .map(m -> MemberDTO.builder()
                                                                .id(m.getUser().getId())
                                                                .fullName(m.getUser().getFullName())
                                                                .username(m.getUser().getUsername())
                                                                .avatarUrl(m.getUser().getAvatarUrl())
                                                                .role(m.getRole().name())
                                                                .build())
                                                .toList()
                                : List.of();

                return TripDetailDTO.builder()
                                .id(trip.getId())
                                .name(trip.getName())
                                .description(trip.getDescription())
                                .bannerUrl(trip.getBannerUrl())
                                .status(trip.getStatus().name())
                                .currentTag(computeTag(trip.getStartDate(), trip.getEndDate()))
                                .startDate(trip.getStartDate())
                                .endDate(trip.getEndDate())
                                .createdBy(UserProfileDTO.from(trip.getCreatedBy()))
                                .members(memberDTOs)
                                .createdAt(trip.getCreatedAt() != null ? trip.getCreatedAt().toString() : null)
                                .build();
        }

        private static String computeTag(LocalDate startDate, LocalDate endDate) {
                LocalDate today = LocalDate.now();
                if (startDate == null)
                        return "UPCOMING";
                if (startDate.isAfter(today))
                        return "UPCOMING";
                if (endDate != null && !endDate.isBefore(today))
                        return "CURRENT";
                return "DONE";
        }
}
