import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from 'react';
const Ctx = createContext(null);
export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('hm_theme');
        if (saved)
            return saved;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });
    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        localStorage.setItem('hm_theme', theme);
    }, [theme]);
    return (_jsx(Ctx.Provider, { value: { theme, toggle: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')) }, children: children }));
}
export function useTheme() {
    const c = useContext(Ctx);
    if (!c)
        throw new Error('useTheme must be used inside ThemeProvider');
    return c;
}
