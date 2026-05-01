import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Moon, Sun } from 'lucide-react';
import { Button, Input, Toast } from '@/components/ui';
import BrandMark from '@/components/BrandMark';
import { useAuth } from '@/store/auth';
import { useTheme } from '@/store/theme';
import { apiErrorMessage } from '@/api/client';
export default function Login() {
    const { login } = useAuth();
    const { theme, toggle } = useTheme();
    const nav = useNavigate();
    const [email, setEmail] = useState('hr@hiremind.ai');
    const [password, setPassword] = useState('Hr123456!');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    async function submit(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await login(email, password);
            nav('/app');
        }
        catch (err) {
            setError(apiErrorMessage(err));
        }
        finally {
            setLoading(false);
        }
    }
    return (_jsxs("div", { className: "min-h-screen grid lg:grid-cols-2 bg-bg text-fg", children: [_jsxs("div", { className: "hidden lg:flex relative app-mesh items-center justify-center p-10", children: [_jsx("div", { className: "absolute inset-0 dot-grid opacity-30" }), _jsxs("div", { className: "relative max-w-md text-center", children: [_jsxs(Link, { to: "/", className: "inline-flex items-center gap-2 mb-8", children: [_jsx(BrandMark, { size: 36 }), _jsxs("span", { className: "font-semibold text-lg", children: ["HireMind ", _jsx("span", { className: "gradient-text", children: "AI" })] })] }), _jsxs("h2", { className: "text-3xl font-semibold tracking-tight leading-tight", children: [_jsx("span", { className: "gradient-text", children: "Explainable" }), " hiring,", _jsx("br", {}), " from the first CV."] }), _jsx("p", { className: "mt-4 text-subtle", children: "Read CVs, score candidates with reasons, and let HR keep the final call." }), _jsxs("div", { className: "mt-8 inline-flex flex-col gap-2 text-left text-xs text-subtle bg-surface/60 backdrop-blur border border-border rounded-xl px-4 py-3", children: [_jsx("div", { className: "text-fg font-medium text-sm mb-1", children: "Demo accounts" }), _jsxs("div", { children: [_jsx("span", { className: "font-mono text-fg", children: "hr@hiremind.ai" }), " \u00B7 Hr123456!"] }), _jsxs("div", { children: [_jsx("span", { className: "font-mono text-fg", children: "candidate@hiremind.ai" }), " \u00B7 Cand123!"] })] })] })] }), _jsx("div", { className: "flex items-center justify-center p-6", children: _jsxs("div", { className: "w-full max-w-sm", children: [_jsxs("div", { className: "flex items-center justify-between mb-8 lg:mb-12", children: [_jsxs(Link, { to: "/", className: "flex items-center gap-2 lg:hidden", children: [_jsx(BrandMark, { size: 28 }), _jsxs("span", { className: "font-semibold", children: ["HireMind ", _jsx("span", { className: "gradient-text", children: "AI" })] })] }), _jsx("button", { onClick: toggle, className: "ml-auto h-9 w-9 rounded-lg flex items-center justify-center text-subtle hover:text-fg hover:bg-fg/[0.06]", "aria-label": "Toggle theme", children: theme === 'dark' ? _jsx(Sun, { className: "h-4 w-4" }) : _jsx(Moon, { className: "h-4 w-4" }) })] }), _jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: "Welcome back" }), _jsx("p", { className: "mt-1 text-sm text-subtle", children: "Sign in to continue to your dashboard." }), _jsxs("form", { onSubmit: submit, className: "mt-8 space-y-4", children: [_jsx(Input, { label: "Email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, autoComplete: "email" }), _jsx(Input, { label: "Password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, autoComplete: "current-password" }), error && _jsx(Toast, { kind: "error", children: error }), _jsx(Button, { type: "submit", loading: loading, className: "w-full", iconRight: _jsx(ArrowRight, { className: "h-4 w-4" }), children: "Sign in" })] }), _jsxs("div", { className: "mt-6 text-center text-sm text-subtle", children: ["No account? ", _jsx(Link, { to: "/register", className: "text-brand-600 dark:text-brand-400 font-medium", children: "Create one" })] })] }) })] }));
}
