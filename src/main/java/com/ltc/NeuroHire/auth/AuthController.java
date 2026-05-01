package com.ltc.NeuroHire.auth;

import com.ltc.NeuroHire.auth.dto.AuthDto;
import com.ltc.NeuroHire.common.api.ApiResponse;
import com.ltc.NeuroHire.security.CurrentUser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Auth", description = "Registration, login, token refresh, current user")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "Register a new user (CANDIDATE / HR / etc.)")
    @PostMapping("/register")
    public ApiResponse<AuthDto.AuthResponse> register(@Valid @RequestBody AuthDto.RegisterRequest req) {
        return ApiResponse.ok(authService.register(req), "Registered successfully");
    }

    @Operation(summary = "Login and receive JWT tokens")
    @PostMapping("/login")
    public ApiResponse<AuthDto.AuthResponse> login(@Valid @RequestBody AuthDto.LoginRequest req) {
        return ApiResponse.ok(authService.login(req), "Login successful");
    }

    @Operation(summary = "Refresh access token using a valid refresh token")
    @PostMapping("/refresh")
    public ApiResponse<AuthDto.AuthResponse> refresh(@Valid @RequestBody AuthDto.RefreshRequest req) {
        return ApiResponse.ok(authService.refresh(req));
    }

    @Operation(summary = "Get current authenticated user profile")
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/me")
    public ApiResponse<AuthDto.UserResponse> me() {
        return ApiResponse.ok(authService.me(CurrentUser.get().userId()));
    }
}
