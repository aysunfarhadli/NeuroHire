package com.ltc.NeuroHire.cv.dto;

import com.ltc.NeuroHire.common.enums.ParsingStatus;

import java.time.Instant;

public class CvDto {

    public record UploadResponse(
            Long id,
            String fileName,
            String contentType,
            long fileSize,
            ParsingStatus parsingStatus,
            Instant createdAt
    ) {}

    public record CvSummary(
            Long id,
            String fileName,
            long fileSize,
            ParsingStatus parsingStatus,
            String parsingError,
            Instant createdAt
    ) {}

    public record CvDetail(
            Long id,
            String fileName,
            String contentType,
            long fileSize,
            ParsingStatus parsingStatus,
            String parsingError,
            String extractedText,
            Instant createdAt,
            Instant updatedAt
    ) {}

    public record CandidateProfileDto(
            Long id,
            Long userId,
            String fullName,
            String email,
            String phone,
            String location,
            String summary,
            String structuredJson
    ) {}
}
