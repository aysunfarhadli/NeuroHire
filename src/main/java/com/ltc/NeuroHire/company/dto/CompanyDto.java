package com.ltc.NeuroHire.company.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CompanyDto {

    public record CreateRequest(
            @NotBlank @Size(max = 200) String name,
            @Size(max = 100) String industry,
            @Size(max = 50) String subscriptionPlan,
            @Size(max = 500) String website,
            @Size(max = 1000) String description
    ) {}

    public record UpdateRequest(
            @Size(max = 200) String name,
            @Size(max = 100) String industry,
            @Size(max = 50) String subscriptionPlan,
            @Size(max = 500) String website,
            @Size(max = 1000) String description
    ) {}

    public record Response(
            Long id, String name, String industry, String subscriptionPlan,
            String website, String description
    ) {}
}
