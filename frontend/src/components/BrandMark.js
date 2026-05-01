import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function BrandMark({ size = 36 }) {
    return (_jsxs("div", { className: "relative inline-flex items-center justify-center rounded-2xl overflow-hidden", style: { width: size, height: size }, "aria-label": "HireMind AI logo", children: [_jsx("span", { className: "absolute inset-0 brand-ring" }), _jsx("span", { className: "absolute inset-[2px] rounded-[12px] bg-bg" }), _jsxs("span", { className: "relative z-10 font-semibold text-fg", style: { fontSize: size * 0.42 }, children: ["H", _jsx("span", { className: "gradient-text", children: "M" })] })] }));
}
