import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button, Input, Select, Toast } from '@/components/ui';
import BrandMark from '@/components/BrandMark';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useAuth } from '@/store/auth';
import { useTheme } from '@/store/theme';
import { apiErrorMessage } from '@/api/client';
import type { Role } from '@/types/api';

export default function Register() {
  const { t } = useTranslation();
  const { register } = useAuth();
  const { theme, toggle } = useTheme();
  const nav = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('CANDIDATE');
  const [companyId, setCompanyId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const u = await register({ fullName, email, password, role, companyId: companyId ? Number(companyId) : null });
      if (u.role === 'SUPER_ADMIN') nav('/superadmin');
      else nav('/app');
    } catch (err) { setError(apiErrorMessage(err)); }
    finally { setLoading(false); }
  }

  const needsCompany = role === 'HR' || role === 'HIRING_MANAGER' || role === 'RECRUITER_AGENCY';

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
            {t('auth.leftTagline1Register')} <span className="gradient-text">{t('auth.leftTagline2Register')}</span>{t('auth.leftTagline3Register')}
          </h2>
          <p className="mt-4 text-subtle">{t('auth.leftSubRegister')}</p>
        </div>
      </div>

      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="flex items-center justify-between mb-8 lg:mb-12">
            <Link to="/" className="flex items-center gap-2 lg:hidden">
              <BrandMark size={28} />
              <span className="font-semibold">HireMind <span className="gradient-text">AI</span></span>
            </Link>
            <div className="ml-auto flex items-center gap-1.5">
              <LanguageSwitcher />
              <button onClick={toggle}
                className="h-9 w-9 rounded-lg flex items-center justify-center text-subtle hover:text-fg hover:bg-fg/[0.06]"
                aria-label="Toggle theme">
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{t('auth.registerTitle')}</h1>
          <p className="mt-1 text-sm text-subtle">{t('auth.registerSub')}</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <Input label={t('auth.fullName')} value={fullName} onChange={(e) => setFullName(e.target.value)} required minLength={2} />
            <Input label={t('auth.email')} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input label={t('auth.passwordMin')} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
            <Select label={t('auth.iAmA')} value={role} onChange={(e) => setRole(e.target.value as Role)}>
              <option value="CANDIDATE">{t('auth.candidate')}</option>
              <option value="HR">{t('auth.hr')}</option>
              <option value="HIRING_MANAGER">{t('auth.hiringManager')}</option>
              <option value="RECRUITER_AGENCY">{t('auth.recruiterAgency')}</option>
            </Select>
            {needsCompany && (
              <Input label={t('auth.companyId')} type="number" value={companyId} onChange={(e) => setCompanyId(e.target.value)} hint={t('auth.companyHint') ?? ''} />
            )}
            {error && <Toast kind="error">{error}</Toast>}
            <Button type="submit" loading={loading} className="w-full" iconRight={<ArrowRight className="h-4 w-4" />}>
              {t('auth.createAccountBtn')}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-subtle">
            {t('auth.haveAccount')} <Link to="/login" className="text-brand-600 dark:text-brand-400 font-medium">{t('auth.haveAccountCta')}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
