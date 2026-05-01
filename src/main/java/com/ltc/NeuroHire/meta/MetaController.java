package com.ltc.NeuroHire.meta;

import com.ltc.NeuroHire.common.api.ApiResponse;
import com.ltc.NeuroHire.common.enums.PipelineStageType;
import com.ltc.NeuroHire.common.enums.Recommendation;
import com.ltc.NeuroHire.common.enums.Role;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.Map;

@Tag(name = "Meta", description = "Server meta / enums / health (no auth)")
@RestController
@RequestMapping("/api/meta")
public class MetaController {

    @Value("${app.product.name}")
    private String productName;

    @Value("${app.product.version}")
    private String productVersion;

    @Operation(summary = "Health probe")
    @GetMapping("/health")
    public ApiResponse<Map<String, Object>> health() {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("status", "UP");
        body.put("product", productName);
        body.put("version", productVersion);
        body.put("time", Instant.now().toString());
        return ApiResponse.ok(body);
    }

    @Operation(summary = "Enum dictionaries for the frontend (roles, stages, recommendations)")
    @GetMapping("/enums")
    public ApiResponse<Map<String, Object>> enums() {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("roles", Arrays.stream(Role.values()).map(Enum::name).toList());
        body.put("pipelineStages", Arrays.stream(PipelineStageType.values()).map(Enum::name).toList());
        body.put("recommendations", Arrays.stream(Recommendation.values()).map(Enum::name).toList());
        return ApiResponse.ok(body);
    }
}
