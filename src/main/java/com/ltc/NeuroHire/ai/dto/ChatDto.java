package com.ltc.NeuroHire.ai.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class ChatDto {

    public enum Audience { GUEST, CANDIDATE, HR, SUPER_ADMIN }

    public record Message(String role, String content) {}

    public record Request(
            @NotEmpty List<Message> messages,
            @NotNull Audience audience
    ) {}

    public record Reply(String reply, List<String> suggestedActions) {}

    public record CoverLetterRequest(
            @jakarta.validation.constraints.NotNull Long jobId,
            Long cvId
    ) {}

    public record CoverLetter(String coverLetter, String mode) {}
}
