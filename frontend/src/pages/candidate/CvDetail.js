import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, FileText, RefreshCw, Sparkles } from 'lucide-react';
import { Badge, Button, Card, CardBody, CardHeader, ScoreRing, Skeleton, Toast } from '@/components/ui';
import { getCv } from '@/api/cv';
import { analyzeCv, latestCvAnalysis } from '@/api/ai';
import { listJobs } from '@/api/jobs';
import { apiErrorMessage } from '@/api/client';
import { formatBytes, formatDate } from '@/lib/format';
const RECOMMENDATION_TONE = {
    STRONG_MATCH: 'green',
    POTENTIAL_MATCH: 'amber',
    WEAK_MATCH: 'red',
};
export default function CvDetailPage() {
    const { id } = useParams();
    const cvId = Number(id);
    const [cv, setCv] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        getCv(cvId).then(setCv).catch((e) => setError(apiErrorMessage(e)));
        listJobs().then(setJobs).catch(() => { });
        latestCvAnalysis(cvId).then(setAnalysis).catch(() => setAnalysis(null));
    }, [cvId]);
    async function runAnalysis() {
        setLoading(true);
        setError(null);
        try {
            const a = await analyzeCv(cvId, selectedJob === '' ? undefined : Number(selectedJob));
            setAnalysis(a);
        }
        catch (err) {
            setError(apiErrorMessage(err));
        }
        finally {
            setLoading(false);
        }
    }
    if (!cv) {
        return (_jsxs("div", { className: "space-y-4", children: [_jsx(Skeleton, { className: "h-8 w-48" }), _jsx(Skeleton, { className: "h-32" }), _jsx(Skeleton, { className: "h-64" })] }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs(Link, { to: "/app/cv", className: "inline-flex items-center gap-2 text-sm text-subtle hover:text-fg", children: [_jsx(ArrowLeft, { className: "h-4 w-4" }), " Back to CVs"] }), _jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "h-12 w-12 rounded-xl bg-fg/[0.06] flex items-center justify-center", children: _jsx(FileText, { className: "h-5 w-5" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-xl font-semibold truncate", children: cv.fileName }), _jsxs("div", { className: "text-sm text-subtle", children: [formatBytes(cv.fileSize), " \u00B7 ", cv.contentType, " \u00B7 uploaded ", formatDate(cv.createdAt)] })] })] }), _jsxs("div", { className: "flex items-end gap-2", children: [_jsxs("select", { className: "h-10 px-3 rounded-lg bg-surface border border-border text-fg text-sm", value: selectedJob, onChange: (e) => setSelectedJob(e.target.value === '' ? '' : Number(e.target.value)), children: [_jsx("option", { value: "", children: "Match against (no job)" }), jobs.map((j) => _jsx("option", { value: j.id, children: j.title }, j.id))] }), _jsx(Button, { onClick: runAnalysis, loading: loading, iconLeft: _jsx(Sparkles, { className: "h-4 w-4" }), children: analysis ? 'Re-analyze' : 'Analyze with AI' })] })] }), error && _jsx(Toast, { kind: "error", children: error }), cv.parsingStatus !== 'DONE' && (_jsxs(Toast, { kind: "info", children: ["Parsing status: ", cv.parsingStatus, ". ", cv.parsingError && _jsxs("span", { children: ["\u00B7 ", cv.parsingError] })] })), analysis ? (_jsx(AnalysisView, { a: analysis })) : (_jsx(Card, { children: _jsxs(CardBody, { className: "text-center py-14", children: [_jsx("div", { className: "mx-auto h-12 w-12 rounded-full bg-fg/[0.05] flex items-center justify-center mb-3 text-subtle", children: _jsx(Sparkles, { className: "h-5 w-5" }) }), _jsx("h3", { className: "font-semibold", children: "No analysis yet" }), _jsxs("p", { className: "text-sm text-subtle mt-1 max-w-md mx-auto", children: ["Optionally pick a job above to score this CV against it, then click ", _jsx("em", { children: "Analyze with AI" }), "."] })] }) })), _jsxs(Card, { children: [_jsx(CardHeader, { title: "Extracted text", subtitle: "What the AI sees from your CV" }), _jsx(CardBody, { children: _jsx("pre", { className: "whitespace-pre-wrap text-xs text-fg/80 font-mono leading-relaxed max-h-80 overflow-y-auto", children: cv.extractedText || '— extraction in progress —' }) })] })] }));
}
function AnalysisView({ a }) {
    const breakdown = [
        { label: 'Skills', value: a.scoreBreakdown.skills },
        { label: 'Experience', value: a.scoreBreakdown.experience },
        { label: 'Education', value: a.scoreBreakdown.education },
        { label: 'Domain', value: a.scoreBreakdown.domain },
        { label: 'ATS', value: a.scoreBreakdown.atsFormat },
    ];
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(Card, { children: _jsxs(CardBody, { className: "grid md:grid-cols-3 gap-6 items-center", children: [_jsxs("div", { className: "flex flex-col items-center justify-center", children: [_jsx("div", { className: "relative", children: _jsx(ScoreRing, { value: a.matchScore, label: "Match", size: 140 }) }), _jsx(Badge, { tone: RECOMMENDATION_TONE[a.recommendation], children: a.recommendation.replace('_', ' ') }), _jsxs("div", { className: "mt-1 text-xs text-subtle", children: ["AI confidence: ", (a.aiConfidence * 100).toFixed(0), "%"] })] }), _jsxs("div", { className: "md:col-span-2", children: [_jsx("div", { className: "text-xs uppercase tracking-wider text-subtle mb-1", children: "Candidate level" }), _jsx("div", { className: "text-lg font-semibold", children: a.candidateLevel }), _jsx("p", { className: "mt-3 text-sm text-fg/90 leading-relaxed", children: a.professionalSummary }), _jsx("div", { className: "mt-4 grid grid-cols-5 gap-2", children: breakdown.map((b) => (_jsxs("div", { className: "rounded-lg bg-fg/[0.04] p-2 text-center", children: [_jsx("div", { className: "text-[10px] uppercase tracking-wider text-subtle", children: b.label }), _jsx("div", { className: "text-lg font-semibold mt-0.5", children: b.value })] }, b.label))) })] })] }) }), _jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { title: "Strengths" }), _jsxs(CardBody, { className: "space-y-2", children: [a.strengths.length === 0 && _jsx("span", { className: "text-sm text-subtle", children: "\u2014" }), a.strengths.map((s, i) => (_jsxs("div", { className: "text-sm flex gap-2", children: [_jsx("span", { className: "text-emerald-500", children: "\u2713" }), s] }, i)))] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { title: "Weaknesses" }), _jsxs(CardBody, { className: "space-y-2", children: [a.weaknesses.length === 0 && _jsx("span", { className: "text-sm text-subtle", children: "\u2014" }), a.weaknesses.map((s, i) => (_jsxs("div", { className: "text-sm flex gap-2", children: [_jsx("span", { className: "text-amber-500", children: "!" }), s] }, i)))] })] })] }), _jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { title: "Technical skills detected" }), _jsxs(CardBody, { className: "flex flex-wrap gap-2", children: [a.technicalSkills.map((s) => _jsx(Badge, { tone: "violet", children: s }, s)), a.technicalSkills.length === 0 && _jsx("span", { className: "text-sm text-subtle", children: "None detected" })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { title: "Missing keywords", subtitle: "Found in job, missing from CV" }), _jsxs(CardBody, { className: "flex flex-wrap gap-2", children: [a.missingKeywords.map((s) => _jsx(Badge, { tone: "red", children: s }, s)), a.missingKeywords.length === 0 && _jsx("span", { className: "text-sm text-subtle", children: "All required keywords present." })] })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { title: "HR explanation", subtitle: "Why the score is what it is" }), _jsx(CardBody, { children: _jsx("p", { className: "text-sm leading-relaxed text-fg/90", children: a.hrExplanation }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { title: "Feedback for you", subtitle: "Concrete next steps" }), _jsx(CardBody, { children: _jsx("p", { className: "text-sm leading-relaxed text-fg/90", children: a.candidateFeedback }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { title: "CV rewrite suggestions", subtitle: "Before / after" }), _jsx(CardBody, { className: "space-y-4", children: a.cvRewrites.map((r, i) => (_jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "rounded-lg border border-border p-3", children: [_jsx("div", { className: "text-[10px] uppercase tracking-wider text-subtle mb-1", children: "Before" }), _jsx("div", { className: "text-sm", children: r.before })] }), _jsxs("div", { className: "rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3", children: [_jsx("div", { className: "text-[10px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1", children: "After" }), _jsx("div", { className: "text-sm", children: r.after }), _jsxs("div", { className: "text-xs text-subtle mt-2", children: [_jsx(RefreshCw, { className: "inline h-3 w-3 mr-1" }), r.reason] })] })] }, i))) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { title: "Interview preparation", subtitle: "Likely questions you should be ready for" }), _jsx(CardBody, { className: "space-y-3", children: a.interviewQuestions.map((q, i) => (_jsxs("div", { className: "rounded-lg border border-border p-3", children: [_jsx("div", { className: "text-sm font-medium", children: q.question }), _jsxs("div", { className: "text-xs text-subtle mt-1", children: ["Why: ", q.reason] })] }, i))) })] }), a.riskFlags.length > 0 && (_jsxs(Card, { children: [_jsx(CardHeader, { title: "Risk flags", subtitle: "Manual review recommended" }), _jsx(CardBody, { className: "space-y-2", children: a.riskFlags.map((f, i) => (_jsxs("div", { className: "flex gap-2 text-sm", children: [_jsx(AlertTriangle, { className: "h-4 w-4 text-amber-500 shrink-0 mt-0.5" }), f] }, i))) })] }))] }));
}
