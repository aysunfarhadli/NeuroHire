import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Skeleton, StatTile } from '@/components/ui';
import { listJobs } from '@/api/jobs';
export default function Analytics() {
    const [jobs, setJobs] = useState(null);
    useEffect(() => { listJobs().then(setJobs).catch(() => setJobs([])); }, []);
    if (jobs === null) {
        return _jsxs("div", { className: "space-y-4", children: [_jsx(Skeleton, { className: "h-32" }), _jsx(Skeleton, { className: "h-64" })] });
    }
    const open = jobs.filter((j) => j.status === 'OPEN').length;
    const senCounts = jobs.reduce((acc, j) => {
        const k = j.seniority || 'UNSPECIFIED';
        acc[k] = (acc[k] || 0) + 1;
        return acc;
    }, {});
    const max = Math.max(1, ...Object.values(senCounts));
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-semibold", children: "Analytics" }), _jsx("p", { className: "text-sm text-subtle mt-1", children: "A quick read on your hiring pipeline health." })] }), _jsxs("div", { className: "grid sm:grid-cols-3 gap-4", children: [_jsx(StatTile, { label: "Total jobs", value: jobs.length, accent: "brand" }), _jsx(StatTile, { label: "Open positions", value: open, accent: "green" }), _jsx(StatTile, { label: "Closed / draft", value: jobs.length - open, accent: "amber" })] }), _jsxs(Card, { children: [_jsx(CardHeader, { title: "Jobs by seniority", subtitle: "Distribution across your postings" }), _jsxs(CardBody, { className: "space-y-3", children: [Object.entries(senCounts).map(([k, v]) => (_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between text-sm mb-1", children: [_jsx("span", { className: "font-medium", children: k }), _jsx("span", { className: "text-subtle", children: v })] }), _jsx("div", { className: "h-2 bg-fg/[0.07] rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-gradient-to-r from-brand-500 to-violet-500", style: { width: `${(v / max) * 100}%` } }) })] }, k))), Object.keys(senCounts).length === 0 && (_jsx("div", { className: "text-sm text-subtle text-center py-4", children: "No data yet \u2014 create some jobs first." }))] })] })] }));
}
