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
public class UserSearchResultDTO {
    private UUID id;
    private String fullName;
    private String username;
    private String avatarUrl;

    public static UserSearchResultDTO from(User user) {
        return UserSearchResultDTO.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .username(user.getUsername())
                .avatarUrl(user.getAvatarUrl())
                .build();
    }
}
