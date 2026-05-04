package com.ltc.NeuroHire.company;

import com.ltc.NeuroHire.common.api.ApiResponse;
import com.ltc.NeuroHire.company.dto.CompanyDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Companies", description = "Company management for HR / Recruiter accounts")
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService service;

    @Operation(summary = "Create company")
    @PreAuthorize("hasAnyRole('HR','ADMIN','RECRUITER_AGENCY')")
    @PostMapping
    public ApiResponse<CompanyDto.Response> create(@Valid @RequestBody CompanyDto.CreateRequest req) {
        return ApiResponse.ok(service.create(req), "Company created");
    }

    @Operation(summary = "Get company by id")
    @GetMapping("/{id}")
    public ApiResponse<CompanyDto.Response> get(@PathVariable Long id) {
        return ApiResponse.ok(service.get(id));
    }

    @Operation(summary = "Public list of companies (no auth)")
    @GetMapping("/public")
    public ApiResponse<List<CompanyDto.Response>> publicList() {
        return ApiResponse.ok(service.list());
    }

    @Operation(summary = "Public company profile (no auth)")
    @GetMapping("/public/{id}")
    public ApiResponse<CompanyDto.Response> publicGet(@PathVariable Long id) {
        return ApiResponse.ok(service.get(id));
    }

    @Operation(summary = "List companies")
    @PreAuthorize("hasAnyRole('ADMIN','HR','RECRUITER_AGENCY')")
    @GetMapping
    public ApiResponse<List<CompanyDto.Response>> list() {
        return ApiResponse.ok(service.list());
    }

    @Operation(summary = "Update company")
    @PreAuthorize("hasAnyRole('HR','ADMIN','RECRUITER_AGENCY')")
    @PutMapping("/{id}")
    public ApiResponse<CompanyDto.Response> update(@PathVariable Long id,
                                                   @Valid @RequestBody CompanyDto.UpdateRequest req) {
        return ApiResponse.ok(service.update(id, req), "Company updated");
    }

    @Operation(summary = "Delete company")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ApiResponse.ok(null, "Company deleted");
    }
}
