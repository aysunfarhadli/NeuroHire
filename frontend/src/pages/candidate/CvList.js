import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Trash2, Upload } from 'lucide-react';
import { Badge, Button, Card, CardBody, CardHeader, EmptyState, Skeleton, Toast } from '@/components/ui';
import { deleteCv, myCvs, uploadCv } from '@/api/cv';
import { formatBytes, relativeTime } from '@/lib/format';
import { apiErrorMessage } from '@/api/client';
export default function CvList() {
    const [cvs, setCvs] = useState(null);
    const [error, setError] = useState(null);
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef(null);
    async function load() {
        try {
            setCvs(await myCvs());
        }
        catch (e) {
            setError(apiErrorMessage(e));
        }
    }
    useEffect(() => { load(); }, []);
    async function onPick(e) {
        const file = e.target.files?.[0];
        if (!file)
            return;
        setUploading(true);
        setError(null);
        try {
            await uploadCv(file);
            if (fileRef.current)
                fileRef.current.value = '';
            await load();
            // re-poll to catch parsing completion
            setTimeout(load, 1500);
            setTimeout(load, 4000);
        }
        catch (err) {
            setError(apiErrorMessage(err));
        }
        finally {
            setUploading(false);
        }
    }
    async function onDelete(id) {
        if (!confirm('Delete this CV?'))
            return;
        try {
            await deleteCv(id);
            await load();
        }
        catch (e) {
            setError(apiErrorMessage(e));
        }
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-semibold", children: "My CVs" }), _jsx("p", { className: "text-sm text-subtle mt-1", children: "Upload PDF or DOCX. Parsing and AI analysis happen automatically." })] }), _jsx("input", { ref: fileRef, type: "file", accept: ".pdf,.docx,.doc,.txt,application/pdf", className: "hidden", onChange: onPick }), _jsx(Button, { onClick: () => fileRef.current?.click(), loading: uploading, iconLeft: _jsx(Upload, { className: "h-4 w-4" }), children: uploading ? 'Uploading...' : 'Upload CV' })] }), error && _jsx(Toast, { kind: "error", children: error }), _jsxs(Card, { children: [_jsx(CardHeader, { title: "All CVs", subtitle: "Most recent first" }), _jsx(CardBody, { className: "p-0", children: cvs === null ? (_jsxs("div", { className: "p-5 space-y-3", children: [_jsx(Skeleton, { className: "h-12" }), _jsx(Skeleton, { className: "h-12" }), _jsx(Skeleton, { className: "h-12" })] })) : cvs.length === 0 ? (_jsx(EmptyState, { icon: _jsx(FileText, { className: "h-6 w-6" }), title: "No CVs yet", description: "Upload your first CV to receive AI analysis, missing-skills suggestions, and rewrite recommendations.", action: _jsx(Button, { onClick: () => fileRef.current?.click(), iconLeft: _jsx(Upload, { className: "h-4 w-4" }), children: "Upload CV" }) })) : (_jsx("ul", { className: "divide-y divide-border", children: cvs.map((cv) => (_jsxs("li", { className: "flex items-center justify-between px-5 py-3.5", children: [_jsxs(Link, { to: `/app/cv/${cv.id}`, className: "flex items-center gap-3 min-w-0 flex-1", children: [_jsx("div", { className: "h-10 w-10 rounded-lg bg-fg/[0.06] flex items-center justify-center shrink-0", children: _jsx(FileText, { className: "h-4 w-4" }) }), _jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "text-sm font-medium truncate", children: cv.fileName }), _jsxs("div", { className: "text-xs text-subtle", children: [formatBytes(cv.fileSize), " \u00B7 ", relativeTime(cv.createdAt)] }), cv.parsingError && _jsx("div", { className: "text-xs text-red-500 mt-0.5", children: cv.parsingError })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [cv.parsingStatus === 'DONE' && _jsx(Badge, { tone: "green", children: "Parsed" }), cv.parsingStatus === 'PROCESSING' && _jsx(Badge, { tone: "blue", children: "Processing" }), cv.parsingStatus === 'PENDING' && _jsx(Badge, { tone: "amber", children: "Pending" }), cv.parsingStatus === 'FAILED' && _jsx(Badge, { tone: "red", children: "Failed" }), _jsx("button", { onClick: () => onDelete(cv.id), className: "h-8 w-8 rounded-md hover:bg-red-500/10 text-subtle hover:text-red-500 flex items-center justify-center", "aria-label": "Delete", children: _jsx(Trash2, { className: "h-4 w-4" }) })] })] }, cv.id))) })) })] })] }));
}
