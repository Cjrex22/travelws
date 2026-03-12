package com.wandrr.modules.buddies;

import com.wandrr.modules.user.dto.UserSearchResultDTO;

public record BuddyAddResponse(UserSearchResultDTO buddy, long newBuddyCount) {
}
