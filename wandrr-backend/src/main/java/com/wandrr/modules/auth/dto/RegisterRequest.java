package com.wandrr.modules.auth.dto;

import jakarta.validation.constraints.*;

public record RegisterRequest(
        @NotBlank @Size(min = 2, max = 100) String fullName,
        @NotBlank @Email String email,
        @NotBlank @Size(min = 8) @Pattern(regexp = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).+$", message = "Password must contain uppercase, number and special character") String password,
        @NotBlank String confirmPassword,
        @Size(max = 500) String bio) {
}
