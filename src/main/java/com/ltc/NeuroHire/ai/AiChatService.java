package com.ltc.NeuroHire.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.ltc.NeuroHire.ai.dto.ChatDto;
import com.ltc.NeuroHire.auth.UserRepository;
import com.ltc.NeuroHire.common.enums.Role;
import com.ltc.NeuroHire.company.CompanyRepository;
import com.ltc.NeuroHire.job.JobPostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;
import java.util.Locale;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiChatService {

    private final UserRepository userRepo;
    private final CompanyRepository companyRepo;
    private final JobPostRepository jobRepo;
    private final ObjectMapper mapper;

    @Value("${app.ai.provider}")
    private String provider;

    @Value("${app.ai.model}")
    private String model;

    @Value("${app.ai.api-key:}")
    private String apiKey;

    @Value("${app.ai.base-url:}")
    private String baseUrl;

    public ChatDto.Reply chat(ChatDto.Request req) {
        String lastUser = req.messages().stream()
                .filter(m -> "user".equalsIgnoreCase(m.role()))
                .map(ChatDto.Message::content)
                .reduce((a, b) -> b)
                .orElse("");

        if ("openai".equalsIgnoreCase(provider) && apiKey != null && !apiKey.isBlank() && !"changeme".equals(apiKey)) {
            try {
                return openAiChat(req);
            } catch (Exception ex) {
                log.warn("OpenAI chat call failed, falling back to scripted reply: {}", ex.getMessage());
            }
        }

        return scriptedReply(req.audience(), lastUser);
    }

    private ChatDto.Reply scriptedReply(ChatDto.Audience audience, String userText) {
        String text = userText.toLowerCase(Locale.ROOT);
        long openJobs = jobRepo.findByStatusOrderByCreatedAtDesc("OPEN").size();
        long companies = companyRepo.count();
        long candidates = userRepo.findAll().stream().filter(u -> u.getRole() == Role.CANDIDATE).count();

        if (text.contains("how does ai") || text.contains("how does scoring") || text.contains("how does the ai")) {
            return new ChatDto.Reply(
                    "Each CV gets five scores — Skills, Experience, Education, Domain, ATS — based on the job's must-have and nice-to-have keywords. "
                            + "We then output a recommendation (STRONG/POTENTIAL/WEAK MATCH) plus an HR-readable reason. Sensitive attributes "
                            + "(age, gender, photo, nationality) are masked from scoring with bias guard turned on.",
                    List.of("Show me a sample analysis", "Try uploading a CV", "What's the bias guard?")
            );
        }
        if (text.contains("free") || text.contains("price") || text.contains("cost")) {
            return new ChatDto.Reply(
                    "HireMind AI is free during the MVP — no credit card needed. Self-hosting is supported for enterprise.",
                    List.of("How do I sign up?", "Show me jobs", "Talk to sales")
            );
        }
        if (text.contains("remote")) {
            return new ChatDto.Reply(
                    "We currently have remote roles across EMEA and the US. Try the Jobs page and filter Location: 'Remote'.",
                    List.of("Open Jobs page", "Filter by Senior", "Show companies hiring remotely")
            );
        }
        if (text.contains("review") && (text.contains("cv") || text.contains("resume"))) {
            return new ChatDto.Reply(
                    "Sure — head to the Candidate dashboard, upload a CV (PDF or DOCX), then click Analyze. I'll output a score breakdown, "
                            + "interview questions, and concrete CV rewrite suggestions.",
                    List.of("Open My CVs", "What file formats are supported?", "How long does analysis take?")
            );
        }
        if (text.contains("job description") || (text.contains("draft") && text.contains("job"))) {
            return new ChatDto.Reply(
                    "Open the Jobs panel → New job. Give me a title and a couple of keywords, and I'll draft the description, must-haves, and screening questions.",
                    List.of("Create a new job", "Show me a sample JD", "Suggest screening questions")
            );
        }
        if (text.contains("stat") || text.contains("metric") || text.contains("how many")) {
            return new ChatDto.Reply(
                    String.format("Right now: %d open jobs across %d companies, with %d active candidates on the platform.",
                            openJobs, companies, candidates),
                    List.of("Top hiring companies", "Most popular roles", "Recent applications")
            );
        }

        return switch (audience) {
            case GUEST -> new ChatDto.Reply(
                    "I can help you find roles or explain how HireMind's AI scoring works. There are " + openJobs
                            + " open jobs across " + companies + " companies right now.",
                    List.of("Show me jobs", "How does AI scoring work?", "How do I sign up?")
            );
            case CANDIDATE -> new ChatDto.Reply(
                    "Want me to review your latest CV, suggest matching jobs, or coach you for an interview?",
                    List.of("Review my latest CV", "Find jobs that match me", "Help me prep for an interview")
            );
            case HR -> new ChatDto.Reply(
                    "I can summarize your top applicants, draft a job description, or generate screening questions. What would you like to do?",
                    List.of("Summarize my top applicants", "Draft a job description", "Suggest screening questions")
            );
            case SUPER_ADMIN -> new ChatDto.Reply(
                    "Platform health check: " + companies + " companies, " + openJobs + " open jobs, " + candidates
                            + " candidates. Anything you'd like to dig into?",
                    List.of("Show top companies by hiring", "Flagged content this week", "User signups today")
            );
        };
    }

    private ChatDto.Reply openAiChat(ChatDto.Request req) throws Exception {
        ObjectNode body = mapper.createObjectNode();
        body.put("model", model);
        ArrayNode arr = body.putArray("messages");
        arr.addObject().put("role", "system").put("content", systemPromptFor(req.audience()));
        for (ChatDto.Message m : req.messages()) {
            arr.addObject().put("role", "user".equalsIgnoreCase(m.role()) ? "user" : "assistant")
                    .put("content", m.content());
        }
        body.put("max_tokens", 400);

        HttpClient client = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(8)).build();
        HttpRequest http = HttpRequest.newBuilder()
                .uri(URI.create((baseUrl == null || baseUrl.isBlank() ? "https://api.openai.com/v1" : baseUrl) + "/chat/completions"))
                .timeout(Duration.ofSeconds(20))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + apiKey)
                .POST(HttpRequest.BodyPublishers.ofString(mapper.writeValueAsString(body)))
                .build();
        HttpResponse<String> resp = client.send(http, HttpResponse.BodyHandlers.ofString());
        if (resp.statusCode() / 100 != 2) {
            throw new RuntimeException("LLM HTTP " + resp.statusCode() + ": " + resp.body());
        }
        JsonNode root = mapper.readTree(resp.body());
        String content = root.path("choices").path(0).path("message").path("content").asText("");
        return new ChatDto.Reply(content.isBlank() ? "(empty response)" : content.trim(), List.of());
    }

    private String systemPromptFor(ChatDto.Audience aud) {
        return switch (aud) {
            case GUEST -> "You are HireMind's friendly assistant on a public hiring platform. Keep replies short, helpful, and honest. "
                    + "If a user wants to apply, suggest registering. Never invent jobs or numbers.";
            case CANDIDATE -> "You are HireMind's career coach. The user is a job seeker. Help with CV review, job matching, and interview prep. Be specific and warm.";
            case HR -> "You are HireMind's recruiting copilot. The user is HR/recruiter. Help summarize applicants, draft job descriptions, and screening questions. Be precise.";
            case SUPER_ADMIN -> "You are HireMind's platform-ops assistant. The user is the platform super admin. Help with metrics, moderation, and incident triage.";
        };
    }
}
