import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Users, KanbanSquare, FileText, BarChart3, Settings, LogOut, Sun, Moon, } from 'lucide-react';
import { useAuth } from '@/store/auth';
import { useTheme } from '@/store/theme';
import BrandMark from './BrandMark';
export default function Layout() {
    const { user, logout } = useAuth();
    const { theme, toggle } = useTheme();
    const navigate = useNavigate();
    const isCandidate = user?.role === 'CANDIDATE';
    const candidateNav = [
        { to: '/app', icon: LayoutDashboard, label: 'Dashboard', end: true },
        { to: '/app/cv', icon: FileText, label: 'My CVs' },
        { to: '/app/jobs', icon: Briefcase, label: 'Open jobs' },
        { to: '/app/settings', icon: Settings, label: 'Settings' },
    ];
    const hrNav = [
        { to: '/app', icon: LayoutDashboard, label: 'Dashboard', end: true },
        { to: '/app/jobs', icon: Briefcase, label: 'Jobs' },
        { to: '/app/candidates', icon: Users, label: 'Candidates' },
        { to: '/app/pipeline', icon: KanbanSquare, label: 'Pipeline' },
        { to: '/app/analytics', icon: BarChart3, label: 'Analytics' },
        { to: '/app/settings', icon: Settings, label: 'Settings' },
    ];
    const nav = isCandidate ? candidateNav : hrNav;
    return (_jsxs("div", { className: "min-h-screen flex bg-bg", children: [_jsxs("aside", { className: "hidden md:flex w-60 shrink-0 flex-col border-r border-border bg-surface relative", children: [_jsx("div", { className: "absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-brand-500/10 to-transparent pointer-events-none" }), _jsxs("div", { className: "relative h-16 px-5 flex items-center gap-2.5 border-b border-border", children: [_jsx(BrandMark, { size: 32 }), _jsxs("div", { children: [_jsxs("div", { className: "text-sm font-semibold text-fg leading-none", children: ["HireMind ", _jsx("span", { className: "gradient-text", children: "AI" })] }), _jsx("div", { className: "text-[10px] uppercase tracking-wider text-subtle mt-1", children: "HR decision support" })] })] }), _jsx("nav", { className: "flex-1 p-3 space-y-0.5 relative", children: nav.map((item) => (_jsxs(NavLink, { to: item.to, end: item.end, className: ({ isActive }) => `relative flex items-center gap-2.5 px-3 h-9 rounded-lg text-sm transition-all ${isActive
                                ? 'bg-gradient-to-r from-brand-500/15 to-brand-500/5 text-brand-700 dark:text-brand-300 font-medium ring-1 ring-brand-500/20'
                                : 'text-subtle hover:text-fg hover:bg-fg/[0.04]'}`, children: [_jsx(item.icon, { className: "h-4 w-4" }), item.label] }, item.to))) }), _jsxs("div", { className: "p-3 border-t border-border", children: [_jsxs("div", { className: "px-2 py-2", children: [_jsx("div", { className: "text-sm font-medium text-fg truncate", children: user?.fullName }), _jsx("div", { className: "text-xs text-subtle truncate", children: user?.email })] }), _jsxs("button", { onClick: logout, className: "mt-1 w-full flex items-center gap-2.5 px-3 h-9 rounded-lg text-sm text-subtle hover:text-fg hover:bg-fg/[0.04]", children: [_jsx(LogOut, { className: "h-4 w-4" }), "Sign out"] })] })] }), _jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [_jsxs("header", { className: "h-16 border-b border-border glass sticky top-0 z-20 flex items-center justify-between px-6", children: [_jsxs("div", { className: "text-sm text-subtle", children: [_jsx("span", { className: "text-fg font-medium", children: user?.role.replace('_', ' ') }), user?.companyId && _jsxs("span", { className: "ml-2", children: ["\u00B7 Company #", user.companyId] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: toggle, className: "h-9 w-9 rounded-lg flex items-center justify-center text-subtle hover:text-fg hover:bg-fg/[0.06]", "aria-label": "Toggle theme", children: theme === 'dark' ? _jsx(Sun, { className: "h-4 w-4" }) : _jsx(Moon, { className: "h-4 w-4" }) }), _jsx("button", { onClick: () => navigate('/app/settings'), className: "h-9 w-9 rounded-lg flex items-center justify-center text-subtle hover:text-fg hover:bg-fg/[0.06]", "aria-label": "Settings", children: _jsx(Settings, { className: "h-4 w-4" }) })] })] }), _jsx("main", { className: "flex-1 p-6 md:p-8 page-fade-in", children: _jsx(Outlet, {}) })] })] }));
}
