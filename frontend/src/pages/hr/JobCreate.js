import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button, Card, CardBody, CardHeader, Input, Select, Textarea, Toast } from '@/components/ui';
import { createJob } from '@/api/jobs';
import { apiErrorMessage } from '@/api/client';
export default function JobCreate() {
    const nav = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [seniority, setSeniority] = useState('MID');
    const [location, setLocation] = useState('');
    const [employmentType, setEmploymentType] = useState('FULL_TIME');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    async function submit(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const j = await createJob({
                title, description,
                seniority: seniority === '' ? undefined : seniority,
                location: location || undefined,
                employmentType: employmentType || undefined,
            });
            nav(`/app/jobs/${j.id}`);
        }
        catch (err) {
            setError(apiErrorMessage(err));
        }
        finally {
            setLoading(false);
        }
    }
    return (_jsxs("div", { className: "space-y-6 max-w-3xl", children: [_jsxs("button", { onClick: () => nav(-1), className: "inline-flex items-center gap-2 text-sm text-subtle hover:text-fg", children: [_jsx(ArrowLeft, { className: "h-4 w-4" }), " Back"] }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-semibold", children: "Create a job" }), _jsx("p", { className: "text-sm text-subtle mt-1", children: "Add the role description \u2014 AI will analyze must-have / nice-to-have skills." })] }), _jsxs(Card, { children: [_jsx(CardHeader, { title: "Job details" }), _jsx(CardBody, { children: _jsxs("form", { onSubmit: submit, className: "space-y-4", children: [_jsx(Input, { label: "Title", value: title, onChange: (e) => setTitle(e.target.value), required: true, maxLength: 200, placeholder: "e.g. Senior Backend Engineer (Spring Boot, Kafka)" }), _jsx(Textarea, { label: "Description", value: description, onChange: (e) => setDescription(e.target.value), required: true, rows: 10, placeholder: "Responsibilities, requirements, must-have/nice-to-have skills..." }), _jsxs("div", { className: "grid sm:grid-cols-3 gap-4", children: [_jsxs(Select, { label: "Seniority", value: seniority, onChange: (e) => setSeniority(e.target.value), children: [_jsx("option", { value: "JUNIOR", children: "Junior" }), _jsx("option", { value: "MID", children: "Mid" }), _jsx("option", { value: "SENIOR", children: "Senior" })] }), _jsx(Input, { label: "Location", value: location, onChange: (e) => setLocation(e.target.value), placeholder: "Baku, AZ" }), _jsxs(Select, { label: "Employment", value: employmentType, onChange: (e) => setEmploymentType(e.target.value), children: [_jsx("option", { value: "FULL_TIME", children: "Full-time" }), _jsx("option", { value: "PART_TIME", children: "Part-time" }), _jsx("option", { value: "CONTRACT", children: "Contract" }), _jsx("option", { value: "INTERN", children: "Internship" })] })] }), error && _jsx(Toast, { kind: "error", children: error }), _jsxs("div", { className: "flex gap-2 pt-2", children: [_jsx(Button, { type: "submit", loading: loading, children: "Create job" }), _jsx(Button, { type: "button", variant: "ghost", onClick: () => nav(-1), children: "Cancel" })] })] }) })] })] }));
}
