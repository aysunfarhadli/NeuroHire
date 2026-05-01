package com.ltc.NeuroHire.ai;

import com.ltc.NeuroHire.ai.dto.CvAnalysisAi;
import com.ltc.NeuroHire.common.api.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Tag(name = "AI", description = "AI-driven CV analysis (structured JSON per spec §12)")
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiAnalysisService analysisService;

    @Operation(summary = "Analyze a CV (optionally against a specific job) and return structured AI output")
    @PostMapping("/cv/{cvId}/analyze")
    public ApiResponse<CvAnalysisAi> analyzeCv(@PathVariable Long cvId,
                                               @RequestParam(required = false) Long jobId) {
        return ApiResponse.ok(analysisService.analyzeCv(cvId, jobId), "AI analysis completed");
    }

    @Operation(summary = "Get the latest stored AI analysis for a CV")
    @GetMapping("/cv/{cvId}/latest")
    public ApiResponse<CvAnalysisAi> latest(@PathVariable Long cvId) {
        return ApiResponse.ok(analysisService.latestForCv(cvId));
    }
}
