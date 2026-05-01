import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { tokenStore } from '@/api/client';
import * as authApi from '@/api/auth';
import type { Role, User } from '@/types/api';

interface AuthCtx {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (i: { fullName: string; email: string; password: string; role: Role; companyId?: number | null }) => Promise<User>;
  logout: () => void;
  refreshMe: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = tokenStore.get();
    if (!t) { setLoading(false); return; }
    authApi.me()
      .then((u) => setUser(u))
      .catch(() => tokenStore.clear())
      .finally(() => setLoading(false));
  }, []);

  const refreshMe = useCallback(async () => {
    try { setUser(await authApi.me()); } catch { /* ignore */ }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const r = await authApi.login(email, password);
    tokenStore.set(r.accessToken, r.refreshToken);
    setUser(r.user);
    return r.user;
  }, []);

  const register = useCallback(
    async (i: { fullName: string; email: string; password: string; role: Role; companyId?: number | null }) => {
      const r = await authApi.register(i);
      tokenStore.set(r.accessToken, r.refreshToken);
      setUser(r.user);
      return r.user;
    },
    []
  );

  const logout = useCallback(() => {
    tokenStore.clear();
    setUser(null);
    window.location.href = '/login';
  }, []);

  return <Ctx.Provider value={{ user, loading, login, register, logout, refreshMe }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
