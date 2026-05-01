import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from 'react';
function cn(...parts) {
    return parts.filter(Boolean).join(' ');
}
export const Button = forwardRef(function Button({ variant = 'primary', size = 'md', loading, iconLeft, iconRight, className, children, disabled, ...rest }, ref) {
    const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:ring-offset-2 focus:ring-offset-bg disabled:opacity-50 disabled:cursor-not-allowed';
    const variants = {
        primary: 'bg-gradient-to-br from-brand-500 to-brand-700 text-white hover:from-brand-600 hover:to-brand-800 shadow-glow hover:shadow-pop hover:-translate-y-px active:translate-y-0',
        secondary: 'bg-fg/[0.06] text-fg hover:bg-fg/[0.1]',
        ghost: 'text-fg hover:bg-fg/[0.06]',
        danger: 'bg-red-600 text-white hover:bg-red-700',
        outline: 'border border-border bg-surface/40 text-fg hover:bg-brand-500/10 hover:border-brand-500/40 hover:text-brand-700 dark:hover:text-brand-300',
    };
    const sizes = {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-5 text-base',
    };
    return (_jsxs("button", { ref: ref, disabled: loading || disabled, className: cn(base, variants[variant], sizes[size], className), ...rest, children: [loading && _jsx("span", { className: "inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" }), !loading && iconLeft, children, !loading && iconRight] }));
});
export function Card({ className, children, hover = false }) {
    return (_jsx("div", { className: cn('relative rounded-xl2 bg-surface border border-border shadow-card', hover && 'glow-card transition-shadow hover:shadow-pop', className), children: children }));
}
export function CardHeader({ title, subtitle, action }) {
    return (_jsxs("div", { className: "flex items-start justify-between gap-4 p-5 border-b border-border", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-base font-semibold text-fg", children: title }), subtitle && _jsx("p", { className: "mt-0.5 text-sm text-subtle", children: subtitle })] }), action] }));
}
export function CardBody({ className, children }) {
    return _jsx("div", { className: cn('p-5', className), children: children });
}
export const Input = forwardRef(function Input({ label, hint, error, className, id, ...rest }, ref) {
    return (_jsxs("label", { className: "block", children: [label && _jsx("span", { className: "block mb-1.5 text-sm font-medium text-fg", children: label }), _jsx("input", { ref: ref, id: id, className: cn('block w-full h-10 px-3 rounded-lg bg-surface border border-border text-fg placeholder:text-subtle/60 transition-all', 'focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500', error && 'border-red-500 focus:ring-red-500/30 focus:border-red-500', className), ...rest }), hint && !error && _jsx("span", { className: "mt-1 block text-xs text-subtle", children: hint }), error && _jsx("span", { className: "mt-1 block text-xs text-red-500", children: error })] }));
});
export function Textarea({ label, error, className, ...rest }) {
    return (_jsxs("label", { className: "block", children: [label && _jsx("span", { className: "block mb-1.5 text-sm font-medium text-fg", children: label }), _jsx("textarea", { className: cn('block w-full px-3 py-2 rounded-lg bg-surface border border-border text-fg placeholder:text-subtle/60', 'focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500', error && 'border-red-500 focus:ring-red-500/30', className), ...rest }), error && _jsx("span", { className: "mt-1 block text-xs text-red-500", children: error })] }));
}
export function Select({ label, children, className, ...rest }) {
    return (_jsxs("label", { className: "block", children: [label && _jsx("span", { className: "block mb-1.5 text-sm font-medium text-fg", children: label }), _jsx("select", { className: cn('block w-full h-10 px-3 rounded-lg bg-surface border border-border text-fg', 'focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500', className), ...rest, children: children })] }));
}
export function Badge({ tone = 'gray', children }) {
    const tones = {
        gray: 'bg-fg/[0.06] text-fg',
        green: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        red: 'bg-red-500/10 text-red-600 dark:text-red-400',
        amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
        blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
        violet: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
    };
    return (_jsx("span", { className: cn('inline-flex items-center gap-1 px-2 h-6 rounded-md text-xs font-medium', tones[tone]), children: children }));
}
export function ScoreRing({ value, size = 120, label }) {
    const v = Math.max(0, Math.min(100, value));
    const r = size / 2 - 8;
    const c = 2 * Math.PI * r;
    const offset = c - (v / 100) * c;
    const color = v >= 75 ? '#10b981' : v >= 55 ? '#f59e0b' : '#ef4444';
    return (_jsxs("div", { className: "inline-flex flex-col items-center justify-center", style: { width: size, height: size }, children: [_jsxs("svg", { width: size, height: size, className: "-rotate-90", children: [_jsx("circle", { cx: size / 2, cy: size / 2, r: r, strokeWidth: 8, stroke: "currentColor", className: "text-fg/[0.08]", fill: "none" }), _jsx("circle", { cx: size / 2, cy: size / 2, r: r, strokeWidth: 8, stroke: color, fill: "none", strokeDasharray: c, strokeDashoffset: offset, strokeLinecap: "round", style: { transition: 'stroke-dashoffset 0.6s ease' } })] }), _jsxs("div", { className: "absolute text-center", children: [_jsx("div", { className: "text-2xl font-semibold text-fg", children: v }), label && _jsx("div", { className: "text-[10px] uppercase tracking-wider text-subtle", children: label })] })] }));
}
export function Skeleton({ className }) {
    return _jsx("div", { className: cn('animate-pulse rounded-md bg-fg/[0.07]', className) });
}
export function EmptyState({ title, description, icon, action }) {
    return (_jsxs("div", { className: "flex flex-col items-center justify-center py-16 text-center", children: [icon && _jsx("div", { className: "mb-4 h-14 w-14 rounded-full bg-fg/[0.05] flex items-center justify-center text-subtle", children: icon }), _jsx("h3", { className: "text-base font-semibold text-fg", children: title }), description && _jsx("p", { className: "mt-1 text-sm text-subtle max-w-sm", children: description }), action && _jsx("div", { className: "mt-5", children: action })] }));
}
export function Toast({ kind = 'info', children }) {
    const tones = {
        info: 'border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400',
        success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        error: 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400',
    };
    return _jsx("div", { className: cn('rounded-lg border px-3 py-2 text-sm', tones[kind]), children: children });
}
export function StatTile({ label, value, hint, accent }) {
    const accents = {
        brand: 'from-brand-500/10 to-brand-500/0',
        green: 'from-emerald-500/10 to-emerald-500/0',
        amber: 'from-amber-500/10 to-amber-500/0',
    };
    return (_jsx(Card, { className: "overflow-hidden", children: _jsxs("div", { className: cn('px-5 py-4 bg-gradient-to-br', accent ? accents[accent] : ''), children: [_jsx("div", { className: "text-xs uppercase tracking-wider text-subtle", children: label }), _jsx("div", { className: "mt-1 text-2xl font-semibold text-fg", children: value }), hint && _jsx("div", { className: "mt-1 text-xs text-subtle", children: hint })] }) }));
}
