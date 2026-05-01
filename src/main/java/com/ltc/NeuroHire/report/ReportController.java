package com.ltc.NeuroHire.report;

import com.ltc.NeuroHire.common.api.ApiResponse;
import com.ltc.NeuroHire.match.MatchService;
import com.ltc.NeuroHire.match.dto.MatchDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Tag(name = "Reports", description = "Export ranking reports (CSV)")
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final MatchService matchService;

    @Operation(summary = "Job ranking summary (JSON)")
    @PreAuthorize("hasAnyRole('HR','ADMIN','RECRUITER_AGENCY','HIRING_MANAGER')")
    @GetMapping("/jobs/{jobId}")
    public ApiResponse<List<MatchDto.RankingRow>> jobReport(@PathVariable Long jobId) {
        return ApiResponse.ok(matchService.ranking(jobId));
    }

    @Operation(summary = "Job ranking export as CSV")
    @PreAuthorize("hasAnyRole('HR','ADMIN','RECRUITER_AGENCY','HIRING_MANAGER')")
    @GetMapping(value = "/jobs/{jobId}/csv", produces = "text/csv")
    public ResponseEntity<byte[]> exportCsv(@PathVariable Long jobId) {
        List<MatchDto.RankingRow> rows = matchService.ranking(jobId);
        StringBuilder sb = new StringBuilder("matchId,cvId,candidateUserId,totalScore,recommendation\n");
        for (MatchDto.RankingRow r : rows) {
            sb.append(r.matchId()).append(',')
              .append(r.cvId()).append(',')
              .append(r.candidateUserId()).append(',')
              .append(r.totalScore()).append(',')
              .append(r.recommendation()).append('\n');
        }
        byte[] body = sb.toString().getBytes(StandardCharsets.UTF_8);
        String fileName = "job-" + jobId + "-ranking-" + java.time.LocalDate.now().format(DateTimeFormatter.ISO_DATE) + ".csv";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(body);
    }
}
