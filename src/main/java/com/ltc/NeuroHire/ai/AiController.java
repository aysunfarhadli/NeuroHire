package com.ltc.NeuroHire.ai;

import com.ltc.NeuroHire.ai.dto.ChatDto;
import com.ltc.NeuroHire.ai.dto.CvAnalysisAi;
import com.ltc.NeuroHire.auth.UserRepository;
import com.ltc.NeuroHire.common.api.ApiResponse;
import com.ltc.NeuroHire.common.exception.ApiException;
import com.ltc.NeuroHire.cv.CVDocument;
import com.ltc.NeuroHire.cv.CvService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "AI", description = "AI-driven CV analysis (structured JSON per spec §12)")
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiAnalysisService analysisService;
    private final AiChatService chatService;
    private final CoverLetterService coverLetterService;
    private final CvReportPdfService pdfService;
    private final CvService cvService;
    private final UserRepository userRepository;

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

    @Operation(summary = "Generate a tailored cover letter for a job using the candidate's CV")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/cover-letter")
    public ApiResponse<ChatDto.CoverLetter> coverLetter(@Valid @RequestBody ChatDto.CoverLetterRequest req) {
        return ApiResponse.ok(coverLetterService.generate(req), "Cover letter generated");
    }

    @Operation(summary = "Download the AI CV analysis as a branded PDF report")
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping(value = "/cv/{cvId}/report.pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> downloadReport(@PathVariable Long cvId) {
        CVDocument cv = cvService.requireDocument(cvId);
        CvAnalysisAi analysis = analysisService.latestForCv(cvId);
        var candidate = userRepository.findById(cv.getCandidateUserId())
                .orElseThrow(() -> ApiException.notFound("Candidate not found"));
        byte[] pdf = pdfService.generate(cv, analysis, candidate);
        String filename = "cv-analysis-" + cvId + ".pdf";
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=\"" + filename + "\"")
                .header("Content-Type", MediaType.APPLICATION_PDF_VALUE)
                .body(pdf);
    }
}
