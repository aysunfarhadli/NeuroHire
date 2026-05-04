import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Sun, Moon, LogOut, ShieldCheck, LayoutDashboard, Users, Building2, Briefcase } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import BrandMark from '@/components/BrandMark';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTheme } from '@/store/theme';
import { useAuth } from '@/store/auth';

export default function SuperAdminLayout() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  const nav = [
    { to: '/superadmin', icon: LayoutDashboard, label: t('common.dashboard'), end: true },
    { to: '/superadmin/users', icon: Users, label: t('superAdmin.tabUsers') },
    { to: '/superadmin/companies', icon: Building2, label: t('superAdmin.tabCompanies') },
    { to: '/superadmin/jobs', icon: Briefcase, label: t('superAdmin.tabJobs') },
  ];

  return (
    <div className="min-h-screen flex bg-bg">
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border bg-surface relative">
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-red-500/10 to-transparent pointer-events-none" />
        <div className="relative h-16 px-5 flex items-center gap-2.5 border-b border-border">
          <BrandMark size={32} />
          <div>
            <div className="text-sm font-semibold text-fg leading-none flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-red-500" /> {t('common.superAdmin')}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-subtle mt-1">Platform owner</div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 relative">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `relative flex items-center gap-2.5 px-3 h-9 rounded-lg text-sm transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-red-500/15 to-red-500/5 text-red-700 dark:text-red-300 font-medium ring-1 ring-red-500/20'
                    : 'text-subtle hover:text-fg hover:bg-fg/[0.04]'
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <div className="px-2 py-2">
            <div className="text-sm font-medium text-fg truncate">{user?.fullName}</div>
            <div className="text-xs text-subtle truncate">{user?.email}</div>
          </div>
          <button
            onClick={logout}
            className="mt-1 w-full flex items-center gap-2.5 px-3 h-9 rounded-lg text-sm text-subtle hover:text-fg hover:bg-fg/[0.04]"
          >
            <LogOut className="h-4 w-4" />
            {t('common.signOut')}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border glass sticky top-0 z-20 flex items-center justify-between px-6">
          <div className="text-sm text-subtle">
            <span className="inline-flex items-center gap-1.5 px-2 h-6 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-medium">
              <ShieldCheck className="h-3 w-3" /> SUPER_ADMIN
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <LanguageSwitcher />
            <button
              onClick={toggle}
              className="h-9 w-9 rounded-lg flex items-center justify-center text-subtle hover:text-fg hover:bg-fg/[0.06]"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={() => navigate('/')}
              className="h-9 px-3 rounded-lg text-sm text-subtle hover:text-fg hover:bg-fg/[0.06]"
            >
              {t('common.home')}
            </button>
          </div>
        </header>
        <main className="flex-1 p-6 md:p-8 page-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
