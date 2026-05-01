package com.ltc.NeuroHire.ai.dto;

import com.ltc.NeuroHire.common.enums.CandidateLevel;

import java.util.List;

public record JobAnalysisAi(
        List<String> mustHaveSkills,
        List<String> niceToHaveSkills,
        List<String> responsibilities,
        CandidateLevel seniority,
        String domain,
        Integer minYearsExperience
) {}
