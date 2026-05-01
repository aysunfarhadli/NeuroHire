import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Sparkles, Upload } from 'lucide-react';
import { Badge, Button, Card, CardBody, CardHeader, EmptyState, Skeleton, StatTile } from '@/components/ui';
import { myCvs } from '@/api/cv';
import { listPublicOpen } from '@/api/jobs';
import { relativeTime, formatBytes } from '@/lib/format';
export default function CandidateDashboard() {
    const [cvs, setCvs] = useState(null);
    const [jobs, setJobs] = useState(null);
    useEffect(() => {
        myCvs().then(setCvs).catch(() => setCvs([]));
        listPublicOpen().then(setJobs).catch(() => setJobs([]));
    }, []);
    const lastCv = cvs?.[0];
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-semibold", children: "Welcome back" }), _jsx("p", { className: "text-sm text-subtle mt-1", children: "Here's a snapshot of your CVs and open opportunities." })] }), _jsxs("div", { className: "grid sm:grid-cols-3 gap-4", children: [_jsx(StatTile, { label: "My CVs", value: cvs?.length ?? '—', accent: "brand" }), _jsx(StatTile, { label: "Open jobs", value: jobs?.length ?? '—', accent: "green" }), _jsx(StatTile, { label: "Last upload", value: lastCv ? relativeTime(lastCv.createdAt) : '—', hint: lastCv?.fileName, accent: "amber" })] }), _jsxs("div", { className: "grid lg:grid-cols-3 gap-6", children: [_jsxs(Card, { className: "lg:col-span-2", children: [_jsx(CardHeader, { title: "My CVs", subtitle: "Recent uploads \u2014 click to view AI analysis", action: _jsx(Link, { to: "/app/cv", children: _jsx(Button, { size: "sm", iconLeft: _jsx(Upload, { className: "h-4 w-4" }), children: "Upload CV" }) }) }), _jsx(CardBody, { className: "p-0", children: cvs === null ? (_jsxs("div", { className: "p-5 space-y-3", children: [_jsx(Skeleton, { className: "h-12" }), _jsx(Skeleton, { className: "h-12" })] })) : cvs.length === 0 ? (_jsx(EmptyState, { icon: _jsx(FileText, { className: "h-6 w-6" }), title: "No CVs yet", description: "Upload a PDF or DOCX to get instant AI analysis.", action: _jsx(Link, { to: "/app/cv", children: _jsx(Button, { iconLeft: _jsx(Upload, { className: "h-4 w-4" }), children: "Upload CV" }) }) })) : (_jsx("ul", { className: "divide-y divide-border", children: cvs.slice(0, 5).map((cv) => (_jsx("li", { children: _jsxs(Link, { to: `/app/cv/${cv.id}`, className: "flex items-center justify-between px-5 py-3.5 hover:bg-fg/[0.03]", children: [_jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [_jsx("div", { className: "h-9 w-9 rounded-lg bg-fg/[0.06] flex items-center justify-center shrink-0", children: _jsx(FileText, { className: "h-4 w-4" }) }), _jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "text-sm font-medium truncate", children: cv.fileName }), _jsxs("div", { className: "text-xs text-subtle", children: [formatBytes(cv.fileSize), " \u00B7 ", relativeTime(cv.createdAt)] })] })] }), _jsx(ParsingBadge, { status: cv.parsingStatus })] }) }, cv.id))) })) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { title: "Open positions", subtitle: "Roles you can apply to" }), _jsx(CardBody, { className: "p-0", children: jobs === null ? (_jsxs("div", { className: "p-5 space-y-3", children: [_jsx(Skeleton, { className: "h-10" }), _jsx(Skeleton, { className: "h-10" })] })) : jobs.length === 0 ? (_jsx(EmptyState, { icon: _jsx(Sparkles, { className: "h-6 w-6" }), title: "No open jobs", description: "Check back soon." })) : (_jsx("ul", { className: "divide-y divide-border", children: jobs.slice(0, 5).map((j) => (_jsx("li", { children: _jsxs(Link, { to: `/app/jobs/${j.id}`, className: "block px-5 py-3.5 hover:bg-fg/[0.03]", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("div", { className: "text-sm font-medium truncate", children: j.title }), _jsx(ArrowRight, { className: "h-4 w-4 text-subtle" })] }), _jsxs("div", { className: "mt-1 text-xs text-subtle flex gap-2 flex-wrap", children: [j.seniority && _jsx(Badge, { tone: "violet", children: j.seniority }), j.location && _jsx("span", { children: j.location })] })] }) }, j.id))) })) })] })] })] }));
}
function ParsingBadge({ status }) {
    switch (status) {
        case 'DONE': return _jsx(Badge, { tone: "green", children: "Parsed" });
        case 'PROCESSING': return _jsx(Badge, { tone: "blue", children: "Processing" });
        case 'PENDING': return _jsx(Badge, { tone: "amber", children: "Pending" });
        case 'FAILED': return _jsx(Badge, { tone: "red", children: "Failed" });
    }
}
