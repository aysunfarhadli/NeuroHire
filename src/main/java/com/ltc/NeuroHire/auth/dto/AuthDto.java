package com.ltc.NeuroHire.auth.dto;

import com.ltc.NeuroHire.common.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class AuthDto {

    public record RegisterRequest(
            @NotBlank @Size(max = 200) String fullName,
            @NotBlank @Email @Size(max = 200) String email,
            @NotBlank @Size(min = 8, max = 100) String password,
            @NotNull Role role,
            Long companyId
    ) {}

    public record LoginRequest(
            @NotBlank @Email String email,
            @NotBlank String password
    ) {}

    public record RefreshRequest(@NotBlank String refreshToken) {}

    public record AuthResponse(
            String accessToken,
            String refreshToken,
            String tokenType,
            long expiresInMs,
            UserResponse user
    ) {}

    public record UserResponse(
            Long id, String fullName, String email, Role role,
            Long companyId, String phone, String location, boolean enabled
    ) {}
}
