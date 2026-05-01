package com.ltc.NeuroHire.security;

import com.ltc.NeuroHire.common.enums.Role;

public record AuthPrincipal(Long userId, String email, Role role, Long companyId) {}
