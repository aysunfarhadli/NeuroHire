package com.ltc.NeuroHire.ai;

import com.ltc.NeuroHire.ai.dto.ChatDto;
import com.ltc.NeuroHire.ai.dto.CvAnalysisAi;
import com.ltc.NeuroHire.common.api.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Tag(name = "AI", description = "AI-driven CV analysis (structured JSON per spec §12)")
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiAnalysisService analysisService;
    private final AiChatService chatService;

    @Operation(summary = "Analyze a CV (optionally against a specific job) and return structured AI output")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/cv/{cvId}/analyze")
    public ApiResponse<CvAnalysisAi> analyzeCv(@PathVariable Long cvId,
                                               @RequestParam(required = false) Long jobId) {
        return ApiResponse.ok(analysisService.analyzeCv(cvId, jobId), "AI analysis completed");
    }

    @Operation(summary = "Get the latest stored AI analysis for a CV")
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/cv/{cvId}/latest")
    public ApiResponse<CvAnalysisAi> latest(@PathVariable Long cvId) {
        return ApiResponse.ok(analysisService.latestForCv(cvId));
    }

    @Operation(summary = "Conversational assistant — guests, candidates, HR, super admin")
    @PostMapping("/chat")
    public ApiResponse<ChatDto.Reply> chat(@Valid @RequestBody ChatDto.Request req) {
        return ApiResponse.ok(chatService.chat(req));
    }
}
