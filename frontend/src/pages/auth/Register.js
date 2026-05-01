import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Moon, Sun } from 'lucide-react';
import { Button, Input, Select, Toast } from '@/components/ui';
import BrandMark from '@/components/BrandMark';
import { useAuth } from '@/store/auth';
import { useTheme } from '@/store/theme';
import { apiErrorMessage } from '@/api/client';
export default function Register() {
    const { register } = useAuth();
    const { theme, toggle } = useTheme();
    const nav = useNavigate();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('CANDIDATE');
    const [companyId, setCompanyId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    async function submit(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await register({ fullName, email, password, role, companyId: companyId ? Number(companyId) : null });
            nav('/app');
        }
        catch (err) {
            setError(apiErrorMessage(err));
        }
        finally {
            setLoading(false);
        }
    }
    const needsCompany = role === 'HR' || role === 'HIRING_MANAGER' || role === 'RECRUITER_AGENCY';
    return (_jsxs("div", { className: "min-h-screen grid lg:grid-cols-2 bg-bg text-fg", children: [_jsxs("div", { className: "hidden lg:flex relative app-mesh items-center justify-center p-10", children: [_jsx("div", { className: "absolute inset-0 dot-grid opacity-30" }), _jsxs("div", { className: "relative max-w-md text-center", children: [_jsxs(Link, { to: "/", className: "inline-flex items-center gap-2 mb-8", children: [_jsx(BrandMark, { size: 36 }), _jsxs("span", { className: "font-semibold text-lg", children: ["HireMind ", _jsx("span", { className: "gradient-text", children: "AI" })] })] }), _jsxs("h2", { className: "text-3xl font-semibold tracking-tight leading-tight", children: ["Get matched in ", _jsx("span", { className: "gradient-text", children: "minutes" }), ", not months."] }), _jsx("p", { className: "mt-4 text-subtle", children: "Pick a role above \u2014 Candidate or HR \u2014 and start using HireMind right away." })] })] }), _jsx("div", { className: "flex items-center justify-center p-6", children: _jsxs("div", { className: "w-full max-w-sm", children: [_jsxs("div", { className: "flex items-center justify-between mb-8 lg:mb-12", children: [_jsxs(Link, { to: "/", className: "flex items-center gap-2 lg:hidden", children: [_jsx(BrandMark, { size: 28 }), _jsxs("span", { className: "font-semibold", children: ["HireMind ", _jsx("span", { className: "gradient-text", children: "AI" })] })] }), _jsx("button", { onClick: toggle, className: "ml-auto h-9 w-9 rounded-lg flex items-center justify-center text-subtle hover:text-fg hover:bg-fg/[0.06]", "aria-label": "Toggle theme", children: theme === 'dark' ? _jsx(Sun, { className: "h-4 w-4" }) : _jsx(Moon, { className: "h-4 w-4" }) })] }), _jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: "Create your account" }), _jsx("p", { className: "mt-1 text-sm text-subtle", children: "Free to start. No credit card." }), _jsxs("form", { onSubmit: submit, className: "mt-8 space-y-4", children: [_jsx(Input, { label: "Full name", value: fullName, onChange: (e) => setFullName(e.target.value), required: true, minLength: 2 }), _jsx(Input, { label: "Email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true }), _jsx(Input, { label: "Password (8+ chars)", type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, minLength: 8 }), _jsxs(Select, { label: "I am a...", value: role, onChange: (e) => setRole(e.target.value), children: [_jsx("option", { value: "CANDIDATE", children: "Candidate" }), _jsx("option", { value: "HR", children: "HR Manager" }), _jsx("option", { value: "HIRING_MANAGER", children: "Hiring Manager" }), _jsx("option", { value: "RECRUITER_AGENCY", children: "Recruiter Agency" })] }), needsCompany && (_jsx(Input, { label: "Company ID", type: "number", value: companyId, onChange: (e) => setCompanyId(e.target.value), hint: "Use 1 for the seeded demo company" })), error && _jsx(Toast, { kind: "error", children: error }), _jsx(Button, { type: "submit", loading: loading, className: "w-full", iconRight: _jsx(ArrowRight, { className: "h-4 w-4" }), children: "Create account" })] }), _jsxs("div", { className: "mt-6 text-center text-sm text-subtle", children: ["Already have one? ", _jsx(Link, { to: "/login", className: "text-brand-600 dark:text-brand-400 font-medium", children: "Sign in" })] })] }) })] }));
}
