package com.wandrr.modules.user.dto;

import com.wandrr.modules.user.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDTO {
    private UUID id;
    private String fullName;
    private String email;
    private String bio;
    private String avatarUrl;
    private String username;
    private String role;

    public static UserProfileDTO from(User user) {
        return UserProfileDTO.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .bio(user.getBio())
                .avatarUrl(user.getAvatarUrl())
                .username(user.getUsername())
                .role(user.getRole().name())
                .build();
    }
}
