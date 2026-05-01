import { useState, type FormEvent } from 'react';
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
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null);
    try { await login(email, password); nav('/app'); }
    catch (err) { setError(apiErrorMessage(err)); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-bg text-fg">
      <div className="hidden lg:flex relative app-mesh items-center justify-center p-10">
        <div className="absolute inset-0 dot-grid opacity-30" />
        <div className="relative max-w-md text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <BrandMark size={36} />
            <span className="font-semibold text-lg">HireMind <span className="gradient-text">AI</span></span>
          </Link>
          <h2 className="text-3xl font-semibold tracking-tight leading-tight">
            <span className="gradient-text">Explainable</span> hiring,<br /> from the first CV.
          </h2>
          <p className="mt-4 text-subtle">
            Read CVs, score candidates with reasons, and let HR keep the final call.
          </p>
          <div className="mt-8 inline-flex flex-col gap-2 text-left text-xs text-subtle bg-surface/60 backdrop-blur border border-border rounded-xl px-4 py-3">
            <div className="text-fg font-medium text-sm mb-1">Demo accounts</div>
            <div><span className="font-mono text-fg">hr@hiremind.ai</span> · Hr123456!</div>
            <div><span className="font-mono text-fg">candidate@hiremind.ai</span> · Cand123!</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="flex items-center justify-between mb-8 lg:mb-12">
            <Link to="/" className="flex items-center gap-2 lg:hidden">
              <BrandMark size={28} />
              <span className="font-semibold">HireMind <span className="gradient-text">AI</span></span>
            </Link>
            <button onClick={toggle}
              className="ml-auto h-9 w-9 rounded-lg flex items-center justify-center text-subtle hover:text-fg hover:bg-fg/[0.06]"
              aria-label="Toggle theme">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-subtle">Sign in to continue to your dashboard.</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
            <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
            {error && <Toast kind="error">{error}</Toast>}
            <Button type="submit" loading={loading} className="w-full" iconRight={<ArrowRight className="h-4 w-4" />}>
              Sign in
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-subtle">
            No account? <Link to="/register" className="text-brand-600 dark:text-brand-400 font-medium">Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
