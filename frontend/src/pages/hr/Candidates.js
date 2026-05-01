import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Sparkles } from 'lucide-react';
import { Badge, Button, Card, CardBody, CardHeader, EmptyState, Toast } from '@/components/ui';
import { listJobs } from '@/api/jobs';
import { match } from '@/api/match';
import { apiErrorMessage } from '@/api/client';
export default function Candidates() {
    const [jobs, setJobs] = useState([]);
    const [cvIdInput, setCvIdInput] = useState('');
    const [selectedJob, setSelectedJob] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => { listJobs().then(setJobs).catch(() => { }); }, []);
    async function run() {
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const cvId = Number(cvIdInput);
            if (!cvId || !selectedJob)
                throw new Error('Provide both a CV id and a job.');
            setResult(await match(cvId, Number(selectedJob)));
        }
        catch (e) {
            setError(apiErrorMessage(e));
        }
        finally {
            setLoading(false);
        }
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-semibold", children: "Candidates" }), _jsx("p", { className: "text-sm text-subtle mt-1", children: "Match any CV against any job to compute a score." })] }), _jsxs(Card, { children: [_jsx(CardHeader, { title: "Run a match", subtitle: "Enter a CV id and pick a job" }), _jsxs(CardBody, { className: "grid md:grid-cols-3 gap-3 items-end", children: [_jsxs("label", { className: "block", children: [_jsx("span", { className: "block mb-1.5 text-sm font-medium", children: "CV id" }), _jsx("input", { value: cvIdInput, onChange: (e) => setCvIdInput(e.target.value), type: "number", min: 1, className: "block w-full h-10 px-3 rounded-lg bg-surface border border-border text-fg placeholder:text-subtle/60 focus:outline-none focus:ring-2 focus:ring-brand-500/30", placeholder: "e.g. 1" })] }), _jsxs("label", { className: "block", children: [_jsx("span", { className: "block mb-1.5 text-sm font-medium", children: "Job" }), _jsxs("select", { className: "block w-full h-10 px-3 rounded-lg bg-surface border border-border text-fg", value: selectedJob, onChange: (e) => setSelectedJob(e.target.value === '' ? '' : Number(e.target.value)), children: [_jsx("option", { value: "", children: "Select a job..." }), jobs.map((j) => _jsx("option", { value: j.id, children: j.title }, j.id))] })] }), _jsx(Button, { onClick: run, loading: loading, iconLeft: _jsx(Sparkles, { className: "h-4 w-4" }), children: "Run match" })] })] }), error && _jsx(Toast, { kind: "error", children: error }), result ? (_jsxs(Card, { children: [_jsx(CardHeader, { title: `Match #${result.id}`, subtitle: `CV ${result.cvId} ↔ Job ${result.jobId}` }), _jsxs(CardBody, { children: [_jsxs("div", { className: "grid sm:grid-cols-3 md:grid-cols-6 gap-3 text-sm", children: [_jsx(Tile, { label: "Total", value: result.totalScore, highlight: true }), _jsx(Tile, { label: "Skills", value: result.skillScore }), _jsx(Tile, { label: "Experience", value: result.experienceScore }), _jsx(Tile, { label: "Education", value: result.educationScore }), _jsx(Tile, { label: "Domain", value: result.domainScore }), _jsx(Tile, { label: "ATS", value: result.atsScore })] }), _jsx("div", { className: "mt-4", children: _jsx(Badge, { tone: result.recommendation === 'STRONG_MATCH' ? 'green' : result.recommendation === 'POTENTIAL_MATCH' ? 'amber' : 'red', children: result.recommendation.replace('_', ' ') }) }), _jsxs(Link, { to: `/app/cv/${result.cvId}`, className: "mt-4 inline-flex items-center gap-1.5 text-sm text-brand-600 dark:text-brand-400", children: [_jsx(FileText, { className: "h-4 w-4" }), " View full AI analysis"] })] })] })) : (_jsx(Card, { children: _jsx(CardBody, { children: _jsx(EmptyState, { icon: _jsx(Sparkles, { className: "h-6 w-6" }), title: "No match run yet", description: "The candidate flow ends with an explainable score breakdown \u2014 try the demo CV first." }) }) }))] }));
}
function Tile({ label, value, highlight }) {
    return (_jsxs("div", { className: `rounded-lg p-3 ${highlight ? 'bg-brand-500/10 border border-brand-500/30' : 'bg-fg/[0.04]'}`, children: [_jsx("div", { className: "text-[10px] uppercase tracking-wider text-subtle", children: label }), _jsx("div", { className: `mt-0.5 text-xl font-semibold ${highlight ? 'text-brand-600 dark:text-brand-400' : ''}`, children: value })] }));
}
