package com.wandrr.modules.auth;

import com.wandrr.exception.OtpExpiredException;
import com.wandrr.exception.TooManyRequestsException;
import com.wandrr.modules.user.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.mail.internet.MimeMessage;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Random;

@Service
@Slf4j
public class OtpService {

    private final OtpTokenRepository otpTokenRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Autowired(required = false)
    private StringRedisTemplate redisTemplate;

    @Value("${otp.expiry-minutes:10}")
    private int otpExpiryMinutes;

    @Value("${otp.max-requests-per-hour:5}")
    private int maxOtpPerHour;

    @Value("${otp.rate-limit-prefix:otp_rate_}")
    private String rateLimitPrefix;

    @Value("${app.from-email:noreply@wandrr.dev}")
    private String fromEmail;

    public OtpService(OtpTokenRepository otpTokenRepository, PasswordEncoder passwordEncoder) {
        this.otpTokenRepository = otpTokenRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public void generateAndSendOtp(User user) {
        // Rate limit check (only if Redis available)
        if (redisTemplate != null) {
            String rateLimitKey = rateLimitPrefix + user.getEmail();
            try {
                String countStr = redisTemplate.opsForValue().get(rateLimitKey);
                int currentCount = countStr != null ? Integer.parseInt(countStr) : 0;

                if (currentCount >= maxOtpPerHour) {
                    throw new TooManyRequestsException(
                            "Too many OTP requests. Please wait before trying again.");
                }
            } catch (TooManyRequestsException e) {
                throw e;
            } catch (Exception e) {
                log.warn("Redis unavailable for rate limiting, proceeding without rate limit check");
            }
        }

        // Invalidate old OTPs
        otpTokenRepository.invalidateAllForUser(user.getId());

        // Generate 6-digit OTP
        String rawOtp = String.format("%06d", new Random().nextInt(1_000_000));
        String hashedOtp = passwordEncoder.encode(rawOtp);

        // Persist OTP token
        OtpToken token = OtpToken.builder()
                .user(user)
                .otpHash(hashedOtp)
                .purpose(OtpToken.Purpose.PASSWORD_RESET)
                .expiresAt(LocalDateTime.now().plusMinutes(otpExpiryMinutes))
                .build();
        otpTokenRepository.save(token);

        // Increment rate limit counter in Redis
        if (redisTemplate != null) {
            try {
                String rateLimitKey = rateLimitPrefix + user.getEmail();
                redisTemplate.opsForValue().increment(rateLimitKey);
                redisTemplate.expire(rateLimitKey, Duration.ofHours(1));
            } catch (Exception e) {
                log.warn("Redis unavailable for rate limit tracking");
            }
        }

        // Send OTP email (or log if mail is not configured)
        if (mailSender != null) {
            try {
                sendOtpEmail(user.getFullName(), user.getEmail(), rawOtp);
            } catch (Exception e) {
                log.warn("Email sending failed, OTP for {}: {}", user.getEmail(), rawOtp);
            }
        } else {
            log.info("=== DEV MODE OTP for {} === Code: {} ===", user.getEmail(), rawOtp);
        }
        log.info("OTP generated for: {}", user.getEmail());
    }

    public void verifyOtp(User user, String rawOtp) {
        OtpToken token = otpTokenRepository
                .findLatestUnusedForUser(user.getId())
                .orElseThrow(() -> new OtpExpiredException(
                        "No valid OTP found. Please request a new one."));

        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new OtpExpiredException("OTP has expired. Please request a new one.");
        }

        if (!passwordEncoder.matches(rawOtp, token.getOtpHash())) {
            throw new BadCredentialsException("Invalid OTP. Please try again.");
        }

        token.setUsed(true);
        otpTokenRepository.save(token);
    }

    private void sendOtpEmail(String name, String email, String otp) {
        MimeMessage message = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail, "Wandrr Team");
            helper.setTo(email);
            helper.setSubject("Your Wandrr Password Reset Code");
            helper.setText(buildOtpEmailHtml(name, otp), true);
            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send OTP email to: {}", email, e);
            log.info("=== FALLBACK OTP for {} === Code: {} ===", email, otp);
        }
    }

    private String buildOtpEmailHtml(String name, String otp) {
        return """
                <div style="font-family:Inter,sans-serif;max-width:480px;margin:auto;padding:40px;
                            background:#f6f7f8;border-radius:16px;">
                  <h2 style="color:#0a1629;font-size:24px;margin-bottom:8px;">Wandrr ✈️</h2>
                  <p style="color:#555;">Hi %s,</p>
                  <p style="color:#555;">Your one-time password reset code is:</p>
                  <div style="background:#0a1629;color:#fff;font-size:36px;font-weight:900;
                              letter-spacing:12px;text-align:center;padding:24px;border-radius:12px;
                              margin:24px 0;">%s</div>
                  <p style="color:#999;font-size:13px;">This code expires in <strong>10 minutes</strong>.</p>
                  <p style="color:#999;font-size:12px;margin-top:32px;">— The Wandrr Team</p>
                </div>
                """.formatted(name, otp);
    }
}
