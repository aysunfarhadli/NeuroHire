package com.ltc.NeuroHire.common.api;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiError(
        String code,
        String message,
        List<FieldViolation> fieldErrors,
        String correlationId
) {
    public record FieldViolation(String field, String message) {}
}
