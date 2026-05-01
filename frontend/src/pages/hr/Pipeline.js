import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Card, CardBody, EmptyState, Skeleton, Toast } from '@/components/ui';
import { KanbanSquare } from 'lucide-react';
import { listJobs } from '@/api/jobs';
import { listForJob, setStage } from '@/api/pipeline';
import { apiErrorMessage } from '@/api/client';
const STAGES = ['NEW', 'REVIEWED', 'SHORTLISTED', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED'];
const STAGE_TONES = {
    NEW: 'border-blue-500/40',
    REVIEWED: 'border-cyan-500/40',
    SHORTLISTED: 'border-violet-500/40',
    INTERVIEW: 'border-brand-500/40',
    OFFER: 'border-amber-500/40',
    HIRED: 'border-emerald-500/40',
    REJECTED: 'border-red-500/40',
};
export default function Pipeline() {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [entries, setEntries] = useState(null);
    const [error, setError] = useState(null);
    useEffect(() => {
        listJobs().then((js) => {
            setJobs(js);
            if (js.length && selectedJob === null)
                setSelectedJob(js[0].id);
        }).catch(() => { });
    }, []);
    useEffect(() => {
        if (!selectedJob)
            return;
        setEntries(null);
        listForJob(selectedJob).then(setEntries).catch((e) => { setError(apiErrorMessage(e)); setEntries([]); });
    }, [selectedJob]);
    function onDragStart(e, entryId) {
        e.dataTransfer.setData('text/plain', String(entryId));
    }
    async function onDrop(e, stage) {
        e.preventDefault();
        const id = Number(e.dataTransfer.getData('text/plain'));
        const entry = entries?.find((x) => x.id === id);
        if (!entry || entry.stage === stage || !selectedJob)
            return;
        try {
            await setStage({ jobId: selectedJob, candidateUserId: entry.candidateUserId, stage });
            setEntries(await listForJob(selectedJob));
        }
        catch (err) {
            setError(apiErrorMessage(err));
        }
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-start justify-between gap-4 flex-wrap", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-semibold", children: "Pipeline" }), _jsx("p", { className: "text-sm text-subtle mt-1", children: "Drag candidates between stages to update their status." })] }), _jsxs("select", { className: "h-10 px-3 rounded-lg bg-surface border border-border text-fg text-sm", value: selectedJob ?? '', onChange: (e) => setSelectedJob(Number(e.target.value)), children: [_jsx("option", { value: "", children: "Select a job..." }), jobs.map((j) => _jsx("option", { value: j.id, children: j.title }, j.id))] })] }), error && _jsx(Toast, { kind: "error", children: error }), !selectedJob ? (_jsx(Card, { children: _jsx(CardBody, { children: _jsx(EmptyState, { icon: _jsx(KanbanSquare, { className: "h-6 w-6" }), title: "Pick a job", description: "Choose one of your jobs to see its pipeline." }) }) })) : entries === null ? (_jsx("div", { className: "grid grid-cols-2 lg:grid-cols-7 gap-3", children: STAGES.map((s) => _jsx(Skeleton, { className: "h-40" }, s)) })) : (_jsx("div", { className: "grid grid-cols-2 lg:grid-cols-7 gap-3", children: STAGES.map((stage) => {
                    const cards = entries.filter((e) => e.stage === stage);
                    return (_jsxs("div", { onDragOver: (e) => e.preventDefault(), onDrop: (e) => onDrop(e, stage), className: `rounded-xl2 bg-surface border-t-2 ${STAGE_TONES[stage]} border-x border-b border-border p-3 min-h-[220px]`, children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("div", { className: "text-xs uppercase tracking-wider text-subtle font-medium", children: stage }), _jsx("span", { className: "text-xs text-subtle", children: cards.length })] }), _jsxs("div", { className: "space-y-2", children: [cards.length === 0 && _jsx("div", { className: "text-xs text-subtle/60 italic px-1 py-2", children: "Drop here" }), cards.map((c) => (_jsxs("div", { draggable: true, onDragStart: (e) => onDragStart(e, c.id), className: "rounded-lg border border-border bg-bg p-2.5 text-sm cursor-grab active:cursor-grabbing hover:border-brand-500/50", children: [_jsxs("div", { className: "font-medium", children: ["Candidate #", c.candidateUserId] }), c.hrComment && _jsx("div", { className: "text-xs text-subtle mt-1 line-clamp-2", children: c.hrComment })] }, c.id)))] })] }, stage));
                }) }))] }));
}
