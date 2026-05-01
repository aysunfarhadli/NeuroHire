export type Role = 'CANDIDATE' | 'HR' | 'HIRING_MANAGER' | 'RECRUITER_AGENCY' | 'ADMIN';
export type PipelineStage = 'NEW' | 'REVIEWED' | 'SHORTLISTED' | 'INTERVIEW' | 'OFFER' | 'HIRED' | 'REJECTED';
export type Recommendation = 'STRONG_MATCH' | 'POTENTIAL_MATCH' | 'WEAK_MATCH';
export type CandidateLevel = 'JUNIOR' | 'MID' | 'SENIOR';
export type ParsingStatus = 'PENDING' | 'PROCESSING' | 'DONE' | 'FAILED';

export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: { code: string; message: string; fieldErrors?: { field: string; message: string }[]; correlationId?: string };
  timestamp: string;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: Role;
  companyId: number | null;
  phone: string | null;
  location: string | null;
  enabled: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresInMs: number;
  user: User;
}

export interface JobPost {
  id: number;
  companyId: number;
  createdByUserId: number;
  title: string;
  description: string;
  seniority: CandidateLevel | null;
  location: string | null;
  employmentType: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobAnalysis {
  id: number;
  jobId: number;
  mustHaveSkills: string[];
  niceToHaveSkills: string[];
  responsibilities: string[];
  seniority: CandidateLevel | null;
  domain: string | null;
  minYearsExperience: number | null;
}

export interface CvSummary {
  id: number;
  fileName: string;
  fileSize: number;
  parsingStatus: ParsingStatus;
  parsingError: string | null;
  createdAt: string;
}

export interface CvDetail extends CvSummary {
  contentType: string;
  extractedText: string | null;
  updatedAt: string;
}

export interface CvAnalysisAi {
  candidateLevel: CandidateLevel;
  aiConfidence: number;
  professionalSummary: string;
  strengths: string[];
  weaknesses: string[];
  technicalSkills: string[];
  softSkills: string[];
  missingKeywords: string[];
  matchScore: number;
  scoreBreakdown: {
    skills: number;
    experience: number;
    education: number;
    domain: number;
    atsFormat: number;
  };
  recommendation: Recommendation;
  hrExplanation: string;
  candidateFeedback: string;
  interviewQuestions: { question: string; reason: string }[];
  cvRewrites: { before: string; after: string; reason: string }[];
  riskFlags: string[];
}

export interface MatchResult {
  id: number;
  cvId: number;
  jobId: number;
  candidateUserId: number;
  totalScore: number;
  skillScore: number;
  experienceScore: number;
  educationScore: number;
  domainScore: number;
  atsScore: number;
  recommendation: Recommendation;
  explanationJson: string | null;
  createdAt: string;
}

export interface RankingRow {
  matchId: number;
  cvId: number;
  candidateUserId: number;
  totalScore: number;
  recommendation: Recommendation;
}

export interface PipelineEntry {
  id: number;
  jobId: number;
  candidateUserId: number;
  stage: PipelineStage;
  hrComment: string | null;
  updatedByUserId: number | null;
  updatedAt: string;
}
