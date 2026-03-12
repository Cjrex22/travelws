package com.wandrr.modules.auth.dto;

import com.wandrr.modules.user.dto.UserProfileDTO;

public record LoginResponse(
        boolean success,
        String accessToken,
        UserProfileDTO user) {
}
