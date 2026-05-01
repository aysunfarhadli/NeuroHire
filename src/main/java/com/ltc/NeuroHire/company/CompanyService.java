package com.ltc.NeuroHire.company;

import com.ltc.NeuroHire.common.exception.ApiException;
import com.ltc.NeuroHire.company.dto.CompanyDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CompanyService {

    private final CompanyRepository repo;

    public CompanyDto.Response create(CompanyDto.CreateRequest req) {
        repo.findByNameIgnoreCase(req.name()).ifPresent(c -> {
            throw ApiException.conflict("COMPANY_EXISTS", "Company with this name already exists");
        });
        Company c = Company.builder()
                .name(req.name()).industry(req.industry())
                .subscriptionPlan(req.subscriptionPlan())
                .website(req.website()).description(req.description())
                .build();
        return toResponse(repo.save(c));
    }

    @Transactional(readOnly = true)
    public CompanyDto.Response get(Long id) {
        return repo.findById(id).map(this::toResponse)
                .orElseThrow(() -> ApiException.notFound("Company not found"));
    }

    @Transactional(readOnly = true)
    public List<CompanyDto.Response> list() {
        return repo.findAll().stream().map(this::toResponse).toList();
    }

    public CompanyDto.Response update(Long id, CompanyDto.UpdateRequest req) {
        Company c = repo.findById(id).orElseThrow(() -> ApiException.notFound("Company not found"));
        if (req.name() != null) c.setName(req.name());
        if (req.industry() != null) c.setIndustry(req.industry());
        if (req.subscriptionPlan() != null) c.setSubscriptionPlan(req.subscriptionPlan());
        if (req.website() != null) c.setWebsite(req.website());
        if (req.description() != null) c.setDescription(req.description());
        return toResponse(c);
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) throw ApiException.notFound("Company not found");
        repo.deleteById(id);
    }

    public CompanyDto.Response toResponse(Company c) {
        return new CompanyDto.Response(
                c.getId(), c.getName(), c.getIndustry(),
                c.getSubscriptionPlan(), c.getWebsite(), c.getDescription()
        );
    }
}
