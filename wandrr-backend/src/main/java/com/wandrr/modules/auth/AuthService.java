package com.wandrr.modules.auth;

import com.wandrr.exception.AccountNotFoundException;
import com.wandrr.exception.ConflictException;
import com.wandrr.modules.auth.dto.*;
import com.wandrr.modules.user.User;
import com.wandrr.modules.user.UserRepository;
import com.wandrr.modules.user.dto.UserProfileDTO;
import com.wandrr.security.JwtService;
import com.wandrr.util.ApiResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final OtpService otpService;

    @Transactional
    public ApiResponse<UserProfileDTO> register(RegisterRequest request) {
        if (!request.password().equals(request.confirmPassword())) {
            throw new ValidationException("Passwords do not match.");
        }

        if (userRepository.existsByEmail(request.email())) {
            throw new ConflictException("Email already registered. Please sign in.");
        }

        String baseUsername = request.fullName()
                .toLowerCase().replaceAll("\\s+", "_").replaceAll("[^a-z0-9_]", "");
        String username = generateUniqueUsername(baseUsername);

        User user = User.builder()
                .fullName(request.fullName())
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .bio(request.bio())
                .username(username)
                .role(User.Role.USER)
                .build();

        user = userRepository.save(user);
        log.info("New user registered: {}", user.getEmail());

        return ApiResponse.success("Account created successfully. Please sign in.",
                UserProfileDTO.from(user));
    }

    public LoginResponse login(LoginRequest request, HttpServletResponse response) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new AccountNotFoundException(
                        "Account not found. Please get started."));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new BadCredentialsException(
                    "Incorrect password. Please try again or reset your password.");
        }

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        Cookie refreshCookie = new Cookie("refresh_token", refreshToken);
        refreshCookie.setHttpOnly(true);
        // Secure must be false on localhost (HTTP). On Render/HTTPS it should be true.
        String env = System.getenv("SPRING_PROFILES_ACTIVE");
        refreshCookie.setSecure(env != null && env.contains("prod"));
        refreshCookie.setPath("/");
        refreshCookie.setMaxAge(7 * 24 * 60 * 60);
        response.addCookie(refreshCookie);

        return new LoginResponse(true, accessToken, UserProfileDTO.from(user));
    }

    @Transactional
    public ApiResponse<Void> forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new AccountNotFoundException(
                        "No account with this email exists."));

        otpService.generateAndSendOtp(user);
        return ApiResponse.success("OTP sent to " + request.email(), null);
    }

    @Transactional
    public ApiResponse<String> verifyOtp(VerifyOtpRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new AccountNotFoundException("User not found."));

        otpService.verifyOtp(user, request.otp());

        String resetToken = jwtService.generateResetToken(request.email());
        return ApiResponse.success("OTP verified successfully.", resetToken);
    }

    @Transactional
    public ApiResponse<Void> resetPassword(ResetPasswordRequest request) {
        if (!request.newPassword().equals(request.confirmPassword())) {
            throw new ValidationException("Passwords do not match.");
        }

        String email = jwtService.extractEmailFromResetToken(request.resetToken());
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AccountNotFoundException("User not found."));

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);

        log.info("Password reset for user: {}", email);
        return ApiResponse.success("Password reset successfully. Please sign in.", null);
    }

    public ApiResponse<Void> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("refresh_token", "");
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        return ApiResponse.success("Logged out successfully.", null);
    }

    public LoginResponse refreshToken(String refreshTokenValue, HttpServletResponse response) {
        String email = jwtService.extractEmailFromRefreshToken(refreshTokenValue);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AccountNotFoundException("User not found."));

        String accessToken = jwtService.generateAccessToken(user);
        String newRefreshToken = jwtService.generateRefreshToken(user);

        Cookie refreshCookie = new Cookie("refresh_token", newRefreshToken);
        refreshCookie.setHttpOnly(true);
        String envRefresh = System.getenv("SPRING_PROFILES_ACTIVE");
        refreshCookie.setSecure(envRefresh != null && envRefresh.contains("prod"));
        refreshCookie.setPath("/");
        refreshCookie.setMaxAge(7 * 24 * 60 * 60);
        response.addCookie(refreshCookie);

        return new LoginResponse(true, accessToken, UserProfileDTO.from(user));
    }

    private String generateUniqueUsername(String base) {
        if (base.isEmpty())
            base = "user";
        String candidate = base;
        while (userRepository.existsByUsername(candidate)) {
            candidate = base + "_" + (1000 + new Random().nextInt(9000));
        }
        return candidate;
    }
}
