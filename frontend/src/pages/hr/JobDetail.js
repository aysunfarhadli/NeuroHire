import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Brain, Download, Sparkles, Trash2, Users } from 'lucide-react';
import { Badge, Button, Card, CardBody, CardHeader, Skeleton, Toast } from '@/components/ui';
import { analyzeJob, deleteJob, getJob, getJobAnalysis } from '@/api/jobs';
import { ranking } from '@/api/match';
import { apiErrorMessage } from '@/api/client';
import { formatDate } from '@/lib/format';
export default function JobDetail() {
    const { id } = useParams();
    const jobId = Number(id);
    const [job, setJob] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        getJob(jobId).then(setJob).catch((e) => setError(apiErrorMessage(e)));
        getJobAnalysis(jobId).then(setAnalysis).catch(() => setAnalysis(null));
        ranking(jobId).then(setRows).catch(() => setRows([]));
    }, [jobId]);
    async function runAnalyze() {
        setLoading(true);
        setError(null);
        try {
            setAnalysis(await analyzeJob(jobId));
        }
        catch (e) {
            setError(apiErrorMessage(e));
        }
        finally {
            setLoading(false);
        }
    }
    async function onDelete() {
        if (!confirm('Delete this job? This cannot be undone.'))
            return;
        try {
            await deleteJob(jobId);
            window.location.href = '/app/jobs';
        }
        catch (e) {
            setError(apiErrorMessage(e));
        }
    }
    function downloadCsv() {
        const t = localStorage.getItem('hm_access');
        fetch(`/api/reports/jobs/${jobId}/csv`, { headers: { Authorization: `Bearer ${t}` } })
            .then((r) => r.blob())
            .then((b) => {
            const url = URL.createObjectURL(b);
            const a = document.createElement('a');
            a.href = url;
            a.download = `job-${jobId}-ranking.csv`;
            a.click();
            URL.revokeObjectURL(url);
        });
    }
    if (!job)
        return _jsx(Skeleton, { className: "h-64" });
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs(Link, { to: "/app/jobs", className: "inline-flex items-center gap-2 text-sm text-subtle hover:text-fg", children: [_jsx(ArrowLeft, { className: "h-4 w-4" }), " Back to jobs"] }), _jsxs("div", { className: "flex flex-col md:flex-row md:items-start md:justify-between gap-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [_jsx("h1", { className: "text-2xl font-semibold", children: job.title }), _jsx(Badge, { tone: job.status === 'OPEN' ? 'green' : 'gray', children: job.status }), job.seniority && _jsx(Badge, { tone: "violet", children: job.seniority })] }), _jsxs("div", { className: "mt-2 text-sm text-subtle", children: [job.location && _jsxs(_Fragment, { children: [job.location, " \u00B7 "] }), job.employmentType, " \u00B7 created ", formatDate(job.createdAt)] })] }), _jsxs("div", { className: "flex gap-2 flex-wrap", children: [_jsx(Button, { onClick: runAnalyze, loading: loading, iconLeft: _jsx(Sparkles, { className: "h-4 w-4" }), children: analysis ? 'Re-analyze' : 'Analyze with AI' }), _jsx(Button, { onClick: downloadCsv, variant: "outline", iconLeft: _jsx(Download, { className: "h-4 w-4" }), children: "Export CSV" }), _jsx(Button, { onClick: onDelete, variant: "ghost", iconLeft: _jsx(Trash2, { className: "h-4 w-4" }), children: "Delete" })] })] }), error && _jsx(Toast, { kind: "error", children: error }), analysis && (_jsxs(Card, { children: [_jsx(CardHeader, { title: "AI job analysis", subtitle: "Extracted by HireMind AI" }), _jsxs(CardBody, { className: "space-y-5", children: [_jsxs("div", { className: "grid md:grid-cols-3 gap-4 text-sm", children: [_jsx(Meta, { label: "Domain", value: analysis.domain }), _jsx(Meta, { label: "Seniority", value: analysis.seniority }), _jsx(Meta, { label: "Min years", value: analysis.minYearsExperience })] }), _jsx(SkillsBlock, { title: "Must-have skills", tone: "red", items: analysis.mustHaveSkills }), _jsx(SkillsBlock, { title: "Nice-to-have skills", tone: "amber", items: analysis.niceToHaveSkills }), _jsxs("div", { children: [_jsx("div", { className: "text-xs uppercase tracking-wider text-subtle mb-2", children: "Responsibilities" }), _jsx("ul", { className: "space-y-1 text-sm", children: analysis.responsibilities.map((r, i) => (_jsxs("li", { className: "flex gap-2", children: [_jsx("span", { className: "text-brand-500", children: "\u2022" }), r] }, i))) })] })] })] })), _jsxs(Card, { children: [_jsx(CardHeader, { title: "Candidate ranking", subtitle: `${rows.length} candidate${rows.length === 1 ? '' : 's'} matched, sorted by total score`, action: _jsx(Link, { to: `/app/candidates`, children: _jsx(Button, { size: "sm", variant: "outline", iconLeft: _jsx(Users, { className: "h-4 w-4" }), children: "Add candidates" }) }) }), _jsx(CardBody, { className: "p-0", children: rows.length === 0 ? (_jsxs("div", { className: "px-5 py-10 text-center text-sm text-subtle", children: ["No matches yet. Go to ", _jsx(Link, { to: "/app/candidates", className: "text-brand-600 dark:text-brand-400 font-medium", children: "Candidates" }), " to match CVs against this job."] })) : (_jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "text-left text-xs uppercase tracking-wider text-subtle border-b border-border", children: [_jsx("th", { className: "px-5 py-3", children: "#" }), _jsx("th", { className: "px-5 py-3", children: "Candidate" }), _jsx("th", { className: "px-5 py-3", children: "CV" }), _jsx("th", { className: "px-5 py-3", children: "Score" }), _jsx("th", { className: "px-5 py-3", children: "Recommendation" })] }) }), _jsx("tbody", { children: rows.map((r, i) => (_jsxs("tr", { className: "border-b border-border last:border-0", children: [_jsx("td", { className: "px-5 py-3 text-subtle", children: i + 1 }), _jsxs("td", { className: "px-5 py-3", children: ["User #", r.candidateUserId] }), _jsx("td", { className: "px-5 py-3", children: _jsxs(Link, { to: `/app/cv/${r.cvId}`, className: "text-brand-600 dark:text-brand-400", children: ["CV #", r.cvId] }) }), _jsx("td", { className: "px-5 py-3", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "h-2 w-24 bg-fg/[0.07] rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-gradient-to-r from-brand-500 to-violet-500", style: { width: `${r.totalScore}%` } }) }), _jsx("span", { className: "font-semibold", children: r.totalScore })] }) }), _jsx("td", { className: "px-5 py-3", children: _jsx(Badge, { tone: r.recommendation === 'STRONG_MATCH' ? 'green' : r.recommendation === 'POTENTIAL_MATCH' ? 'amber' : 'red', children: r.recommendation.replace('_', ' ') }) })] }, r.matchId))) })] })) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { title: "Description" }), _jsx(CardBody, { children: _jsx("pre", { className: "whitespace-pre-wrap text-sm text-fg/90 font-sans leading-relaxed", children: job.description }) })] })] }));
}
function Meta({ label, value }) {
    return (_jsxs("div", { className: "rounded-lg bg-fg/[0.04] px-3 py-2", children: [_jsx("div", { className: "text-[10px] uppercase tracking-wider text-subtle", children: label }), _jsxs("div", { className: "text-sm font-medium mt-0.5 flex items-center gap-2", children: [_jsx(Brain, { className: "h-3.5 w-3.5 text-brand-500" }), value ?? '—'] })] }));
}
function SkillsBlock({ title, items, tone }) {
    if (!items || items.length === 0)
        return null;
    return (_jsxs("div", { children: [_jsx("div", { className: "text-xs uppercase tracking-wider text-subtle mb-2", children: title }), _jsx("div", { className: "flex flex-wrap gap-1.5", children: items.map((s) => _jsx(Badge, { tone: tone, children: s }, s)) })] }));
}
