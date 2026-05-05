package com.ltc.NeuroHire.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.ltc.NeuroHire.ai.dto.ChatDto;
import com.ltc.NeuroHire.auth.User;
import com.ltc.NeuroHire.auth.UserRepository;
import com.ltc.NeuroHire.common.enums.Role;
import com.ltc.NeuroHire.common.exception.ApiException;
import com.ltc.NeuroHire.company.Company;
import com.ltc.NeuroHire.company.CompanyRepository;
import com.ltc.NeuroHire.cv.CVDocument;
import com.ltc.NeuroHire.cv.CVDocumentRepository;
import com.ltc.NeuroHire.job.JobPost;
import com.ltc.NeuroHire.job.JobPostRepository;
import com.ltc.NeuroHire.security.AuthPrincipal;
import com.ltc.NeuroHire.security.CurrentUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CoverLetterService {

    private final UserRepository userRepo;
    private final CVDocumentRepository cvRepo;
    private final JobPostRepository jobRepo;
    private final CompanyRepository companyRepo;
    private final ObjectMapper mapper;

    @Value("${app.ai.provider}")
    private String provider;

    @Value("${app.ai.model}")
    private String model;

    @Value("${app.ai.api-key:}")
    private String apiKey;

    @Value("${app.ai.base-url:}")
    private String baseUrl;

    private static final List<String> KNOWN_TECH = List.of(
            "java", "spring boot", "spring", "microservices", "docker", "kubernetes",
            "redis", "postgresql", "mongodb", "kafka", "react", "angular", "vue",
            "typescript", "javascript", "python", "node", "rest", "graphql", "jwt",
            "aws", "gcp", "azure", "ml", "machine learning", "pytorch", "tensorflow"
    );

    public ChatDto.CoverLetter generate(ChatDto.CoverLetterRequest req) {
        AuthPrincipal me = CurrentUser.get();
        if (me.role() != Role.CANDIDATE) {
            throw ApiException.forbidden("Only candidates can generate cover letters");
        }
        User candidate = userRepo.findById(me.userId())
                .orElseThrow(() -> ApiException.notFound("User not found"));
        JobPost job = jobRepo.findById(req.jobId())
                .orElseThrow(() -> ApiException.notFound("Job not found"));
        Company company = companyRepo.findById(job.getCompanyId()).orElse(null);

        CVDocument cv = resolveCv(me.userId(), req.cvId());
        if (cv == null) {
            throw ApiException.badRequest("NO_CV", "Upload a CV first — we need it to draft your cover letter");
        }

        if ("openai".equalsIgnoreCase(provider) && apiKey != null && !apiKey.isBlank() && !"changeme".equals(apiKey)) {
            try {
                String text = openAiCoverLetter(candidate, cv, job, company);
                return new ChatDto.CoverLetter(text, "openai");
            } catch (Exception ex) {
                log.warn("OpenAI cover letter failed, falling back to template: {}", ex.getMessage());
            }
        }
        return new ChatDto.CoverLetter(templateCoverLetter(candidate, cv, job, company), "template");
    }

    private CVDocument resolveCv(Long userId, Long cvId) {
        if (cvId != null) {
            return cvRepo.findById(cvId)
                    .filter(c -> c.getCandidateUserId().equals(userId))
                    .orElseThrow(() -> ApiException.badRequest("CV_INVALID", "CV does not belong to you"));
        }
        return cvRepo.findByCandidateUserIdOrderByCreatedAtDesc(userId).stream().findFirst().orElse(null);
    }

    private String templateCoverLetter(User candidate, CVDocument cv, JobPost job, Company company) {
        String cvText = cv.getExtractedText() == null ? "" : cv.getExtractedText().toLowerCase(Locale.ROOT);
        List<String> matchedSkills = KNOWN_TECH.stream()
                .filter(cvText::contains)
                .limit(4)
                .collect(Collectors.toList());

        String firstName = candidate.getFullName() == null ? "Candidate"
                : candidate.getFullName().split("\\s+")[0];
        String companyName = company == null ? "your team" : company.getName();
        String jobTitle = job.getTitle();

        StringBuilder sb = new StringBuilder();
        sb.append("Dear Hiring Team at ").append(companyName).append(",\n\n");

        sb.append("I'm writing to express my interest in the ").append(jobTitle)
          .append(" role at ").append(companyName).append(". ");
        if (!matchedSkills.isEmpty()) {
            sb.append("My background lines up well with what you're looking for — I've worked extensively with ")
              .append(joinHumanList(matchedSkills))
              .append(", and I'm excited about the chance to bring that experience to your team.\n\n");
        } else {
            sb.append("Your description of the role resonates with the work I've been doing, ")
              .append("and I'm excited about the chance to contribute.\n\n");
        }

        sb.append("Across my career I've focused on shipping production code that solves real user problems, ")
          .append("collaborating closely with product and design, and improving systems incrementally rather than ")
          .append("rewriting them. The intersection of those habits with the scope of this role is exactly the ")
          .append("kind of work I'd like to do next.\n\n");

        if (!matchedSkills.isEmpty()) {
            sb.append("A few things you'll find on my CV that map directly to your stack: ")
              .append(joinHumanList(matchedSkills))
              .append(". I'm also comfortable picking up new tools quickly when the work calls for it.\n\n");
        }

        sb.append("I'd love to hear more about the team and the problems you're trying to solve. ")
          .append("Thank you for considering my application.\n\n");
        sb.append("Best regards,\n")
          .append(firstName);

        return sb.toString();
    }

    private String joinHumanList(List<String> items) {
        if (items.isEmpty()) return "";
        if (items.size() == 1) return items.get(0);
        if (items.size() == 2) return items.get(0) + " and " + items.get(1);
        return String.join(", ", items.subList(0, items.size() - 1)) + ", and " + items.get(items.size() - 1);
    }

    private String openAiCoverLetter(User candidate, CVDocument cv, JobPost job, Company company) throws Exception {
        String cvSnippet = trim(cv.getExtractedText(), 4000);
        String jdSnippet = trim(job.getDescription(), 2000);

        String userPrompt = "Write a focused 3-paragraph cover letter for the job below. "
                + "Plain text, no markdown, first-person, warm but professional, max 230 words. "
                + "End with 'Best regards,\\n" + firstName(candidate) + "'.\n\n"
                + "## Candidate name\n" + candidate.getFullName() + "\n\n"
                + "## Job title\n" + job.getTitle() + "\n"
                + "## Company\n" + (company == null ? "—" : company.getName()) + "\n\n"
                + "## Job description\n" + jdSnippet + "\n\n"
                + "## Candidate CV (extracted text)\n" + cvSnippet;

        ObjectNode body = mapper.createObjectNode();
        body.put("model", model);
        ArrayNode arr = body.putArray("messages");
        arr.addObject().put("role", "system")
                .put("content", "You are an expert technical recruiter helping candidates write tailored cover letters. "
                        + "Always ground claims in the candidate CV — never invent experience.");
        arr.addObject().put("role", "user").put("content", userPrompt);
        body.put("max_tokens", 500);
        body.put("temperature", 0.4);

        HttpClient client = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(8)).build();
        HttpRequest http = HttpRequest.newBuilder()
                .uri(URI.create((baseUrl == null || baseUrl.isBlank() ? "https://api.openai.com/v1" : baseUrl) + "/chat/completions"))
                .timeout(Duration.ofSeconds(30))
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
        if (content.isBlank()) throw new RuntimeException("Empty LLM response");
        return content.trim();
    }

    private String trim(String s, int max) {
        if (s == null) return "";
        return s.length() <= max ? s : s.substring(0, max);
    }

    private String firstName(User u) {
        if (u.getFullName() == null) return "Candidate";
        String[] parts = u.getFullName().split("\\s+");
        return parts.length == 0 ? "Candidate" : parts[0];
    }

    @SuppressWarnings("unused")
    private List<String> dummy() {
        // ensure Arrays import isn't culled by tools that strip unused imports
        return Arrays.asList();
    }
}
