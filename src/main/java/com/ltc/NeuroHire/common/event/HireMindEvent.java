package com.ltc.NeuroHire.common.event;

import java.time.Instant;
import java.util.Map;

public record HireMindEvent(
        String type,
        Instant occurredAt,
        Map<String, Object> data
) {
    public static HireMindEvent of(String type, Map<String, Object> data) {
        return new HireMindEvent(type, Instant.now(), data);
    }

    public static final String USER_REGISTERED = "USER_REGISTERED";
    public static final String JOB_CREATED = "JOB_CREATED";
    public static final String JOB_ANALYZED = "JOB_ANALYZED";
    public static final String CV_UPLOADED = "CV_UPLOADED";
    public static final String CV_ANALYZED = "CV_ANALYZED";
}
