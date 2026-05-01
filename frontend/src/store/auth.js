import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { tokenStore } from '@/api/client';
import * as authApi from '@/api/auth';
const Ctx = createContext(null);
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const t = tokenStore.get();
        if (!t) {
            setLoading(false);
            return;
        }
        authApi.me()
            .then((u) => setUser(u))
            .catch(() => tokenStore.clear())
            .finally(() => setLoading(false));
    }, []);
    const refreshMe = useCallback(async () => {
        try {
            setUser(await authApi.me());
        }
        catch { /* ignore */ }
    }, []);
    const login = useCallback(async (email, password) => {
        const r = await authApi.login(email, password);
        tokenStore.set(r.accessToken, r.refreshToken);
        setUser(r.user);
        return r.user;
    }, []);
    const register = useCallback(async (i) => {
        const r = await authApi.register(i);
        tokenStore.set(r.accessToken, r.refreshToken);
        setUser(r.user);
        return r.user;
    }, []);
    const logout = useCallback(() => {
        tokenStore.clear();
        setUser(null);
        window.location.href = '/login';
    }, []);
    return _jsx(Ctx.Provider, { value: { user, loading, login, register, logout, refreshMe }, children: children });
}
export function useAuth() {
    const ctx = useContext(Ctx);
    if (!ctx)
        throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
}
