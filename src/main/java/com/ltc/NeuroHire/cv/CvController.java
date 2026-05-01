package com.ltc.NeuroHire.cv;

import com.ltc.NeuroHire.common.api.ApiResponse;
import com.ltc.NeuroHire.cv.dto.CvDto;
import com.ltc.NeuroHire.security.CurrentUser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Tag(name = "CV", description = "CV upload, parsing, listing")
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/cv")
@RequiredArgsConstructor
public class CvController {

    private final CvService cvService;

    @Operation(summary = "Upload a CV (PDF / DOCX / TXT). Async parsing starts immediately.")
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<CvDto.UploadResponse> upload(@RequestParam("file") MultipartFile file) {
        return ApiResponse.ok(
                cvService.upload(CurrentUser.get().userId(), file),
                "CV uploaded; parsing in progress"
        );
    }

    @Operation(summary = "List my CVs (current authenticated candidate)")
    @GetMapping("/me")
    public ApiResponse<List<CvDto.CvSummary>> myCvs() {
        return ApiResponse.ok(cvService.listForCandidate(CurrentUser.get().userId()));
    }

    @Operation(summary = "Get CV detail by id")
    @GetMapping("/{id}")
    public ApiResponse<CvDto.CvDetail> get(@PathVariable Long id) {
        return ApiResponse.ok(cvService.get(id));
    }

    @Operation(summary = "Delete CV")
    @PreAuthorize("hasAnyRole('CANDIDATE','ADMIN','HR')")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        cvService.delete(id);
        return ApiResponse.ok(null, "CV deleted");
    }
}
