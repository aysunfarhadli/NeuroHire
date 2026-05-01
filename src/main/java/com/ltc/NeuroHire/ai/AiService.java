package com.ltc.NeuroHire.ai;

import com.ltc.NeuroHire.ai.dto.CvAnalysisAi;
import com.ltc.NeuroHire.ai.dto.JobAnalysisAi;
import com.ltc.NeuroHire.common.enums.CandidateLevel;
import com.ltc.NeuroHire.common.enums.Recommendation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Mock LLM provider — replace with real OpenAI / Anthropic / Gemini adapter behind the
 * same interface. Returns the structured JSON shape from spec §12.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AiService {

    @Value("${app.ai.provider}")
    private String provider;

    @Value("${app.ai.model}")
    private String model;

    @Value("${app.ai.confidence-threshold}")
    private double confidenceThreshold;

    private static final List<String> KNOWN_TECH = List.of(
            "java", "spring boot", "spring", "spring cloud", "microservices",
            "docker", "kubernetes", "redis", "postgresql", "mysql", "mongodb",
            "kafka", "rabbitmq", "git", "jenkins", "linux", "react", "angular",
            "vue", "typescript", "javascript", "python", "node", "rest", "graphql",
            "jwt", "oauth", "feign", "eureka", "gateway", "swagger", "openapi",
            "junit", "mockito", "kotlin", "scala", "go", "rust", "aws", "gcp", "azure"
    );

    private static final List<String> KNOWN_SOFT = List.of(
            "communication", "teamwork", "leadership", "problem solving",
            "adaptability", "ownership", "mentoring", "presentation", "english"
    );

    public CvAnalysisAi analyzeCv(String cvText, String jobDescription) {
        String safe = cvText == null ? "" : cvText;
        String jd = jobDescription == null ? "" : jobDescription;

        List<String> techSkills = matchTokens(safe, KNOWN_TECH);
        List<String> softSkills = matchTokens(safe, KNOWN_SOFT);
        List<String> jdTech = matchTokens(jd, KNOWN_TECH);

        Set<String> missing = new LinkedHashSet<>(jdTech);
        techSkills.forEach(missing::remove);

        int years = guessYears(safe);
        CandidateLevel level = years >= 5 ? CandidateLevel.SENIOR
                : years >= 2 ? CandidateLevel.MID
                : CandidateLevel.JUNIOR;

        int skillScore = jdTech.isEmpty() ? 70 : (int) Math.round(100.0 * (jdTech.size() - missing.size()) / jdTech.size());
        int expScore = Math.min(100, 20 + years * 12);
        int eduScore = safe.toLowerCase().contains("bachelor") || safe.toLowerCase().contains("university") ? 80 : 60;
        int domainScore = jdTech.stream().anyMatch(techSkills::contains) ? 75 : 55;
        int atsScore = safe.length() > 200 ? 80 : 50;

        int matchScore = (int) Math.round(skillScore * 0.45 + expScore * 0.25 + eduScore * 0.10 + domainScore * 0.10 + atsScore * 0.10);
        Recommendation rec = matchScore >= 75 ? Recommendation.STRONG_MATCH
                : matchScore >= 55 ? Recommendation.POTENTIAL_MATCH
                : Recommendation.WEAK_MATCH;

        double confidence = Math.min(0.95, 0.5 + safe.length() / 5000.0);

        List<String> strengths = new ArrayList<>();
        if (!techSkills.isEmpty()) strengths.add("Strong technical stack: " + String.join(", ", techSkills));
        if (years >= 3) strengths.add(years + "+ years of relevant experience");
        if (techSkills.contains("docker") || techSkills.contains("kubernetes")) strengths.add("Hands-on with containerized deployment");

        List<String> weaknesses = new ArrayList<>();
        if (!missing.isEmpty()) weaknesses.add("Missing key technologies for this role: " + String.join(", ", missing));
        if (years < 2) weaknesses.add("Limited industry experience for the role's seniority");
        if (atsScore < 70) weaknesses.add("CV layout may not be ATS-friendly");

        List<CvAnalysisAi.InterviewQuestion> questions = new ArrayList<>();
        questions.add(new CvAnalysisAi.InterviewQuestion(
                "Walk me through one project on your CV where you used " +
                        (techSkills.isEmpty() ? "your strongest stack" : techSkills.get(0)) + " end-to-end.",
                "Validate hands-on depth on the candidate's claimed primary stack."
        ));
        if (!missing.isEmpty()) {
            questions.add(new CvAnalysisAi.InterviewQuestion(
                    "How would you approach learning " + missing.iterator().next() + " quickly if hired?",
                    "Probe how the candidate handles a known skill gap."
            ));
        }
        questions.add(new CvAnalysisAi.InterviewQuestion(
                "Tell me about a time you had a technical disagreement with a teammate.",
                "Behavioral signal for collaboration and communication."
        ));

        List<CvAnalysisAi.CvRewrite> rewrites = List.of(
                new CvAnalysisAi.CvRewrite(
                        "Worked on backend.",
                        "Built and shipped REST microservices in Spring Boot serving 1M+ requests/day, reducing P99 latency by 35%.",
                        "Quantify impact and name technologies for ATS keyword match."
                )
        );

        List<String> riskFlags = new ArrayList<>();
        if (safe.length() < 200) riskFlags.add("Extracted CV text is unusually short — manual review recommended");
        if (confidence < confidenceThreshold) riskFlags.add("AI confidence below threshold — request a clearer CV file");

        log.debug("Mock AI CV analysis [{}] score={} rec={}", model, matchScore, rec);

        return new CvAnalysisAi(
                level, confidence,
                "Candidate appears to be a " + level.name().toLowerCase() + " engineer with focus on " +
                        (techSkills.isEmpty() ? "general software development" : String.join(", ", techSkills.subList(0, Math.min(3, techSkills.size())))),
                strengths, weaknesses,
                techSkills, softSkills, new ArrayList<>(missing),
                matchScore,
                new CvAnalysisAi.ScoreBreakdown(skillScore, expScore, eduScore, domainScore, atsScore),
                rec,
                "Score is driven primarily by skill overlap (" + skillScore + ") and experience signal (" + expScore + "). " +
                        (missing.isEmpty() ? "All required keywords detected." : "Missing: " + String.join(", ", missing) + "."),
                "You're a " + rec.name().toLowerCase().replace('_', ' ') + " for this role. " +
                        (missing.isEmpty() ? "Polish your achievements with measurable impact." :
                                "Consider strengthening: " + String.join(", ", missing) + "."),
                questions, rewrites, riskFlags
        );
    }

    public JobAnalysisAi analyzeJob(String title, String description, CandidateLevel seniorityHint) {
        String text = (title + " " + description).toLowerCase();
        List<String> mustHave = matchTokens(text, KNOWN_TECH).stream().limit(8).toList();
        List<String> niceToHave = matchTokens(text, List.of("aws", "kubernetes", "kafka", "graphql", "redis")).stream()
                .filter(s -> !mustHave.contains(s)).toList();

        List<String> resp = new ArrayList<>();
        for (String line : description.split("\\r?\\n")) {
            String t = line.trim();
            if (t.length() > 15 && t.length() < 220 &&
                    (t.startsWith("-") || t.startsWith("•") || t.toLowerCase().matches("^(design|build|develop|implement|maintain|own|lead|review|deliver|collaborate).*"))) {
                resp.add(t.replaceAll("^[-•]\\s*", ""));
            }
            if (resp.size() >= 6) break;
        }
        if (resp.isEmpty()) resp.add("Deliver high-quality, well-tested code in line with team standards");

        Integer years = null;
        Matcher m = Pattern.compile("(\\d+)\\+?\\s*(?:years?|yrs?)").matcher(text);
        if (m.find()) years = Integer.parseInt(m.group(1));

        CandidateLevel sen = seniorityHint;
        if (sen == null) {
            if (text.contains("senior") || (years != null && years >= 5)) sen = CandidateLevel.SENIOR;
            else if (text.contains("junior") || (years != null && years <= 2)) sen = CandidateLevel.JUNIOR;
            else sen = CandidateLevel.MID;
        }

        String domain = inferDomain(text);

        return new JobAnalysisAi(mustHave, niceToHave, resp, sen, domain, years);
    }

    private String inferDomain(String text) {
        if (text.contains("fintech") || text.contains("bank") || text.contains("payment")) return "Fintech";
        if (text.contains("e-commerce") || text.contains("ecommerce") || text.contains("retail")) return "E-commerce";
        if (text.contains("health")) return "Healthcare";
        if (text.contains("hr") || text.contains("recruit")) return "HR Tech";
        return "Software";
    }

    private List<String> matchTokens(String haystack, List<String> needles) {
        String low = haystack.toLowerCase();
        return needles.stream().filter(low::contains).distinct().toList();
    }

    private int guessYears(String text) {
        Matcher m = Pattern.compile("(\\d+)\\+?\\s*(?:years?|yrs?)").matcher(text.toLowerCase());
        int max = 0;
        while (m.find()) {
            try { max = Math.max(max, Integer.parseInt(m.group(1))); } catch (NumberFormatException ignored) {}
        }
        return max;
    }

    public String getModel() { return model; }
    public String getProvider() { return provider; }

    /** Helper to indicate fields meant for hashing in cache keys (Redis-ready). */
    public List<String> sensitiveAttributesToMask() {
        return Arrays.asList("name", "age", "gender", "photo", "nationality", "religion", "marital_status");
    }
}
