<div align="center">

# HireMind AI

**Hire smarter. Get hired faster.**
An AI-powered hiring platform with explainable scoring, bias-guarded screening, and a recruiter-first workflow.

[![Java](https://img.shields.io/badge/Java-17-007396?logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.5-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-ready-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-blue)](#license)

</div>

---

## What it is

HireMind AI is a full-stack hiring platform built around a single idea: **HR keeps the final call, AI gives them a defensible reason for every decision.**

Recruiters get a kanban pipeline with explainable scoring; candidates get instant CV analysis with rewrite suggestions and interview prep; platform owners get a dedicated super-admin console. The whole stack is i18n-ready (EN / AZ / RU), LLM-pluggable (mock → OpenAI / Anthropic / on-prem), and wires up to n8n out of the box.

---

## Demo accounts

After running the app, sign in with any of these — each lands on its own dashboard:

| Role | Email | Password | Lands on |
|---|---|---|---|
| **Super Admin** | `super@hiremind.ai` | `Super123!` | `/superadmin` — platform metrics, user / company / job moderation |
| **HR / Recruiter** | `hr@hiremind.ai` | `Hr123456!` | `/app` — pipeline, candidates, AI job analysis |
| **Candidate** | `candidate@hiremind.ai` | `Cand123!` | `/app` — upload CV, get AI analysis, apply to jobs |

Guests can also browse `/jobs` and `/companies` without logging in.

---

## Why this isn't another job board

| | HireMind AI | Typical job-board template |
|---|---|---|
| Score with reasoning | 5-dimension breakdown (Skills / Experience / Education / Domain / ATS) **plus a sentence per number** | A single opaque match % |
| Bias guard | Age / gender / photo / nationality masked before scoring; HR sees explicit warnings | None |
| CV rewrite | Concrete before / after suggestions tied to the job | Generic "improve your CV" prose |
| Interview prep | Per-candidate questions with reasoning ("Why we ask this") | None |
| LLM provider | Pluggable via config (mock / OpenAI / Anthropic / on-prem Llama) | Hard-coded |
| Workflow integration | n8n webhooks fire on `USER_REGISTERED`, `JOB_CREATED`, `CV_ANALYZED`, ... | None |
| Roles | 6 distinct roles with cross-role 403 enforcement | Admin / user |
| Languages | EN / AZ / RU with full UI translation | English only |
| Onboarding | 5-step animated walkthrough on first visit | None |

---

## Screenshots

> Drop screenshots into `docs/screenshots/` and they'll render here.

<div align="center">

| Landing — premium scroll-driven sections | AI CV analysis with score breakdown |
|:---:|:---:|
| _add `docs/screenshots/landing.png`_ | _add `docs/screenshots/cv-analysis.png`_ |
| **HR pipeline (drag-and-drop kanban)** | **Super-admin moderation console** |
| _add `docs/screenshots/pipeline.png`_ | _add `docs/screenshots/superadmin.png`_ |

</div>

---

## Tech stack

**Backend** — Spring Boot 3.3.5 · Java 17 · Spring Security (JWT) · Spring Data JPA · Apache PDFBox + POI · Jackson · H2 (dev) / PostgreSQL (prod) · Lombok · Springdoc OpenAPI

**Frontend** — React 18 · TypeScript · Vite · Tailwind CSS (dark + light) · React Router · Axios · react-i18next · lucide-react

**Integrations** — n8n webhook publisher · OpenAI / Anthropic-compatible chat completions · Spring `ApplicationEventPublisher` for async fan-out

---

## Architecture

```
┌───────────────────────────────────────────────────────────────────────┐
│                          React + Vite SPA                             │
│  Public  ·  Candidate dash  ·  HR dash  ·  Super Admin  ·  AI chat    │
└───────────────────────────────────────────────────────────────────────┘
                  │  /api/*  (JWT bearer, i18n-aware client)
                  ▼
┌───────────────────────────────────────────────────────────────────────┐
│                  Spring Boot REST API + JPA                           │
│  auth · cv · job · company · application · pipeline · match · ai      │
│  superadmin · meta · report                                           │
└───────────────────────────────────────────────────────────────────────┘
       │                          │                            │
       ▼                          ▼                            ▼
  PostgreSQL / H2          AiService (LLM)           N8nEventPublisher
  (11 entities)            mock / OpenAI / Claude    async webhook fan-out
                                                     ↓
                                                     n8n workflows
                                                     (Slack, ATS, email)
```

Single `./gradlew bootRun` builds the React frontend, copies it into `src/main/resources/static/`, and serves the whole stack from a single Spring Boot process on port `8080`.

---

## Quickstart

**Prerequisites**: JDK 17, Node 20+, npm.

```bash
git clone https://github.com/aysunfarhadli/NeuroHire.git
cd NeuroHire

# Windows (PowerShell)
$env:JAVA_HOME = 'C:\path\to\jdk-17'
.\gradlew.bat bootRun

# macOS / Linux
export JAVA_HOME=/path/to/jdk-17
./gradlew bootRun
```

The first build downloads Gradle 8.10.2 + npm dependencies (~2 minutes). Subsequent builds are ~20 seconds. Open http://localhost:8080.

**Frontend dev mode** (hot reload + Vite proxy → :8080):

```bash
cd frontend
npm install
npm run dev          # Vite on http://localhost:5173
```

---

## Configuration

All toggles live in `src/main/resources/application.properties`.

### LLM provider

```properties
# Default: scripted heuristic (no key required)
app.ai.provider=mock

# Switch to OpenAI / Anthropic / on-prem Llama — no code changes
app.ai.provider=openai
app.ai.api-key=sk-...
app.ai.base-url=https://api.openai.com/v1
app.ai.model=gpt-4o-mini
```

`AiChatService` and `AiService` both honour the same provider switch. When provider is `mock`, the platform returns audience-aware scripted replies grounded in real platform stats (open job count, candidate count, etc.) — useful for demos without a paid key.

### n8n integration

```properties
app.n8n.enabled=true
app.n8n.webhook-url=https://n8n.example.com/webhook/hiremind
```

Once enabled, the following events fire async (fire-and-forget, no impact on user latency):

| Event | Payload |
|---|---|
| `USER_REGISTERED` | `userId`, `email`, `role`, `companyId` |
| `JOB_CREATED` | `jobId`, `title`, `companyId`, `createdByUserId` |
| `CANDIDATE_APPLIED` | `applicationId`, `candidateUserId`, `jobId`, `cvId` |

Build n8n workflows on top: notify Slack on every new application, sync to Greenhouse, send personalized welcome emails — all without writing more backend code.

### Database

H2 in-memory by default (zero setup). Swap to PostgreSQL for production:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/hiremind
spring.datasource.username=hiremind
spring.datasource.password=changeme
spring.jpa.hibernate.ddl-auto=update
```

---

## Project structure

```
NeuroHire/
├── src/main/java/com/ltc/NeuroHire/
│   ├── ai/                    # CV + chat AI services, LLM adapter
│   ├── application/           # Apply flow (Application entity, service, controller)
│   ├── auth/                  # JWT auth, user model, register/login
│   ├── company/               # Companies CRUD + public endpoints
│   ├── cv/                    # Upload, parse (PDFBox/POI), candidate profile
│   ├── job/                   # Job posts + AI job analysis
│   ├── match/                 # CV ↔ job matching with score breakdown
│   ├── pipeline/              # Kanban stages (NEW → REVIEWED → ... → HIRED)
│   ├── superadmin/            # Platform moderation console (SUPER_ADMIN only)
│   ├── integration/n8n/       # Webhook event publisher
│   ├── common/                # ApiResponse, ApiException, BaseEntity, events
│   ├── config/                # DataSeeder, SpaController, AsyncConfig
│   └── security/              # SecurityConfig, JwtService, JwtAuthFilter
│
├── frontend/
│   └── src/
│       ├── api/               # Typed axios clients per domain
│       ├── components/        # UI primitives, layouts, AI chat widget, tour
│       ├── i18n/              # EN / AZ / RU bundles
│       ├── pages/
│       │   ├── auth/          # Login / Register / Landing (with sub-sections)
│       │   ├── candidate/     # Dashboard, CVs, Applications
│       │   ├── hr/            # Dashboard, Jobs, Pipeline, Analytics
│       │   ├── public/        # Guest browsing (Jobs, Companies)
│       │   └── superadmin/    # Console + tabs
│       ├── store/             # Auth + theme contexts
│       └── types/             # API DTOs
│
└── build.gradle               # Spring Boot + Gradle frontend build hooks
```

---

## API surface (highlights)

Full Swagger UI at `http://localhost:8080/swagger-ui.html`. OpenAPI JSON at `/v3/api-docs`.

| Endpoint | Auth | Description |
|---|---|---|
| `POST /api/auth/register` | public | Register as candidate / HR |
| `POST /api/auth/login` | public | Returns JWT access + refresh tokens |
| `GET /api/jobs/public/search?q=&location=` | public | Filtered guest job browsing |
| `GET /api/companies/public` | public | Public company list |
| `POST /api/cv/upload` | candidate | Multipart CV upload, async parse |
| `POST /api/ai/cv/{cvId}/analyze` | candidate | Run AI analysis, returns 5-dim score |
| `POST /api/ai/chat` | public | Conversational assistant (audience-aware) |
| `POST /api/applications` | candidate | Apply to a job (one per candidate per job) |
| `GET /api/applications/me` | candidate | My application list with stage |
| `POST /api/jobs/{id}/analyze` | HR+ | Extract must-have / nice-to-have skills |
| `POST /api/pipeline/stage` | HR+ | Move candidate through pipeline |
| `GET /api/superadmin/dashboard` | super_admin | Platform-wide metrics snapshot |
| `PATCH /api/superadmin/users/{id}/status` | super_admin | Enable / disable user |

---

## Roadmap

- [x] AI CV analysis with explainable scoring
- [x] Multi-role auth + cross-role 403
- [x] Pluggable LLM (mock / OpenAI / Anthropic)
- [x] n8n webhook event publisher
- [x] Apply flow with pipeline mirroring
- [x] 3-language i18n (EN / AZ / RU)
- [x] Onboarding tour
- [x] Premium landing with scroll-driven sections
- [ ] AI cover-letter generator (one-click on apply form)
- [ ] In-app notifications (bell + dropdown)
- [ ] PDF export of CV analysis report
- [ ] CI workflow + automated screenshot diffing
- [ ] Self-hosted Llama / Mistral adapter

---

## License

MIT — see [LICENSE](LICENSE) (or replace with the license of your choice).

---

<div align="center">

Built by [@aysunfarhadli](https://github.com/aysunfarhadli) · Spring Boot + React · 2026

</div>
