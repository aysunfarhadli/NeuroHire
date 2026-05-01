package com.ltc.NeuroHire.auth;

import com.ltc.NeuroHire.auth.dto.AuthDto;
import com.ltc.NeuroHire.common.exception.ApiException;
import com.ltc.NeuroHire.security.JwtProperties;
import com.ltc.NeuroHire.security.JwtService;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final JwtProperties jwtProperties;

    public AuthDto.AuthResponse register(AuthDto.RegisterRequest req) {
        if (userRepository.existsByEmailIgnoreCase(req.email())) {
            throw ApiException.conflict("EMAIL_EXISTS", "Email already registered");
        }
        User user = User.builder()
                .fullName(req.fullName())
                .email(req.email().toLowerCase())
                .passwordHash(passwordEncoder.encode(req.password()))
                .role(req.role())
                .companyId(req.companyId())
                .enabled(true)
                .build();
        user = userRepository.save(user);
        return tokens(user);
    }

    public AuthDto.AuthResponse login(AuthDto.LoginRequest req) {
        User user = userRepository.findByEmailIgnoreCase(req.email())
                .orElseThrow(() -> ApiException.unauthorized("Invalid credentials"));
        if (!user.isEnabled()) throw ApiException.forbidden("Account disabled");
        if (!passwordEncoder.matches(req.password(), user.getPasswordHash())) {
            throw ApiException.unauthorized("Invalid credentials");
        }
        return tokens(user);
    }

    public AuthDto.AuthResponse refresh(AuthDto.RefreshRequest req) {
        Claims claims;
        try {
            claims = jwtService.parse(req.refreshToken());
        } catch (Exception ex) {
            throw ApiException.unauthorized("Invalid refresh token");
        }
        if (!"refresh".equals(claims.get("type", String.class))) {
            throw ApiException.unauthorized("Not a refresh token");
        }
        Long userId = Long.valueOf(claims.getSubject());
        User user = userRepository.findById(userId)
                .orElseThrow(() -> ApiException.unauthorized("User not found"));
        return tokens(user);
    }

    @Transactional(readOnly = true)
    public AuthDto.UserResponse me(Long userId) {
        return userRepository.findById(userId)
                .map(this::toUserResponse)
                .orElseThrow(() -> ApiException.notFound("User not found"));
    }

    private AuthDto.AuthResponse tokens(User user) {
        String access = jwtService.generateAccessToken(user.getId(), user.getEmail(), user.getRole(), user.getCompanyId());
        String refresh = jwtService.generateRefreshToken(user.getId());
        return new AuthDto.AuthResponse(
                access, refresh, "Bearer",
                jwtProperties.getAccessExpirationMs(),
                toUserResponse(user)
        );
    }

    public AuthDto.UserResponse toUserResponse(User u) {
        return new AuthDto.UserResponse(
                u.getId(), u.getFullName(), u.getEmail(), u.getRole(),
                u.getCompanyId(), u.getPhone(), u.getLocation(), u.isEnabled()
        );
    }
}
