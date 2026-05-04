package com.ltc.NeuroHire.job;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ltc.NeuroHire.ai.AiService;
import com.ltc.NeuroHire.ai.dto.JobAnalysisAi;
import com.ltc.NeuroHire.common.event.HireMindEvent;
import com.ltc.NeuroHire.common.exception.ApiException;
import com.ltc.NeuroHire.job.dto.JobDto;
import com.ltc.NeuroHire.security.CurrentUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class JobService {

    private final JobPostRepository repo;
    private final JobAnalysisRepository analysisRepo;
    private final AiService aiService;
    private final ObjectMapper mapper;
    private final ApplicationEventPublisher events;

    public JobDto.Response create(JobDto.CreateRequest req) {
        var principal = CurrentUser.get();
        if (principal.companyId() == null) {
            throw ApiException.badRequest("NO_COMPANY", "Current user is not associated with a company");
        }
        JobPost p = JobPost.builder()
                .companyId(principal.companyId())
                .createdByUserId(principal.userId())
                .title(req.title())
                .description(req.description())
                .seniority(req.seniority())
                .location(req.location())
                .employmentType(req.employmentType())
                .status("OPEN")
                .build();
        JobPost saved = repo.save(p);
        events.publishEvent(HireMindEvent.of(HireMindEvent.JOB_CREATED, Map.of(
                "jobId", saved.getId(),
                "title", saved.getTitle(),
                "companyId", saved.getCompanyId(),
                "createdByUserId", saved.getCreatedByUserId()
        )));
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<JobDto.Response> list() {
        return repo.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<JobDto.Response> listByCompany(Long companyId) {
        return repo.findByCompanyIdOrderByCreatedAtDesc(companyId).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<JobDto.Response> listPublic() {
        return repo.findByStatusOrderByCreatedAtDesc("OPEN").stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<JobDto.Response> searchPublic(String q, String location, String employmentType, String seniority) {
        String keyword = q == null ? null : q.trim().toLowerCase();
        String loc = location == null ? null : location.trim().toLowerCase();
        String type = employmentType == null ? null : employmentType.trim().toUpperCase();
        String level = seniority == null ? null : seniority.trim().toUpperCase();
        return repo.findByStatusOrderByCreatedAtDesc("OPEN").stream()
                .filter(p -> keyword == null || keyword.isEmpty()
                        || (p.getTitle() != null && p.getTitle().toLowerCase().contains(keyword))
                        || (p.getDescription() != null && p.getDescription().toLowerCase().contains(keyword)))
                .filter(p -> loc == null || loc.isEmpty()
                        || (p.getLocation() != null && p.getLocation().toLowerCase().contains(loc)))
                .filter(p -> type == null || type.isEmpty()
                        || (p.getEmploymentType() != null && p.getEmploymentType().equalsIgnoreCase(type)))
                .filter(p -> level == null || level.isEmpty()
                        || (p.getSeniority() != null && p.getSeniority().name().equalsIgnoreCase(level)))
                .map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public JobDto.Response get(Long id) {
        return toResponse(require(id));
    }

    public JobDto.Response update(Long id, JobDto.UpdateRequest req) {
        JobPost p = require(id);
        if (req.title() != null) p.setTitle(req.title());
        if (req.description() != null) p.setDescription(req.description());
        if (req.seniority() != null) p.setSeniority(req.seniority());
        if (req.location() != null) p.setLocation(req.location());
        if (req.employmentType() != null) p.setEmploymentType(req.employmentType());
        if (req.status() != null) p.setStatus(req.status());
        return toResponse(p);
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) throw ApiException.notFound("Job not found");
        repo.deleteById(id);
    }

    public JobDto.AnalysisResponse analyze(Long jobId) {
        JobPost p = require(jobId);
        JobAnalysisAi ai = aiService.analyzeJob(p.getTitle(), p.getDescription(), p.getSeniority());

        JobAnalysis a;
        try {
            a = JobAnalysis.builder()
                    .jobId(jobId)
                    .mustHaveSkillsJson(mapper.writeValueAsString(ai.mustHaveSkills()))
                    .niceToHaveSkillsJson(mapper.writeValueAsString(ai.niceToHaveSkills()))
                    .responsibilitiesJson(mapper.writeValueAsString(ai.responsibilities()))
                    .seniority(ai.seniority() != null ? ai.seniority() : p.getSeniority())
                    .domain(ai.domain())
                    .minYearsExperience(ai.minYearsExperience())
                    .build();
        } catch (Exception ex) {
            throw ApiException.badRequest("AI_PARSE_FAILED", "Could not serialize AI response: " + ex.getMessage());
        }
        a = analysisRepo.save(a);
        return toAnalysisResponse(a);
    }

    @Transactional(readOnly = true)
    public JobDto.AnalysisResponse latestAnalysis(Long jobId) {
        JobAnalysis a = analysisRepo.findFirstByJobIdOrderByCreatedAtDesc(jobId)
                .orElseThrow(() -> ApiException.notFound("No analysis for this job yet"));
        return toAnalysisResponse(a);
    }

    public JobPost require(Long id) {
        return repo.findById(id).orElseThrow(() -> ApiException.notFound("Job not found"));
    }

    private JobDto.Response toResponse(JobPost p) {
        return new JobDto.Response(
                p.getId(), p.getCompanyId(), p.getCreatedByUserId(),
                p.getTitle(), p.getDescription(), p.getSeniority(),
                p.getLocation(), p.getEmploymentType(), p.getStatus(),
                p.getCreatedAt(), p.getUpdatedAt()
        );
    }

    private JobDto.AnalysisResponse toAnalysisResponse(JobAnalysis a) {
        return new JobDto.AnalysisResponse(
                a.getId(), a.getJobId(),
                readList(a.getMustHaveSkillsJson()),
                readList(a.getNiceToHaveSkillsJson()),
                readList(a.getResponsibilitiesJson()),
                a.getSeniority(), a.getDomain(), a.getMinYearsExperience()
        );
    }

    private List<String> readList(String json) {
        if (json == null || json.isBlank()) return Collections.emptyList();
        try {
            return mapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (Exception ex) {
            log.warn("Failed to deserialize list: {}", ex.getMessage());
            return Collections.emptyList();
        }
    }
}
