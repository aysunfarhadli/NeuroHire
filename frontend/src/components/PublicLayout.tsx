import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sun, Moon, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import BrandMark from './BrandMark';
import LanguageSwitcher from './LanguageSwitcher';
import NotificationBell from './NotificationBell';
import TourTrigger from './TourTrigger';
import { Button } from './ui';
import { useTheme } from '@/store/theme';
import { useAuth } from '@/store/auth';

export default function PublicLayout() {
  const { t } = useTranslation();
  const { theme, toggle } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setScrolled(false);
    function onScroll() { setScrolled(window.scrollY > 16); }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname]);

  // On home: transparent over the hero, frosted after scroll. Off-home: always frosted.
  const headerSurface = !isHome || scrolled
    ? 'glass border-b border-border shadow-[0_8px_30px_-12px_rgba(0,0,0,0.25)]'
    : 'bg-transparent border-b border-transparent';

  const navLinkCls = ({ isActive }: { isActive: boolean }) =>
    `text-sm h-9 px-3 rounded-lg flex items-center transition-colors ${
      isActive ? 'text-fg font-medium bg-fg/[0.05]' : 'text-subtle hover:text-fg hover:bg-fg/[0.04]'
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-bg text-fg">
      <header className={`sticky top-0 z-30 transition-all duration-300 ${headerSurface}`}>
        <div className="max-w-7xl mx-auto h-16 px-6 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <BrandMark size={32} />
            <span className="font-semibold tracking-tight hidden sm:inline">
              HireMind <span className="gradient-text">AI</span>
            </span>
          </Link>
          <nav className="ml-2 flex items-center gap-1">
            <NavLink to="/" end className={navLinkCls}>{t('common.home')}</NavLink>
            <NavLink to="/jobs" className={navLinkCls}>{t('common.jobs')}</NavLink>
            <NavLink to="/companies" className={navLinkCls}>{t('common.companies')}</NavLink>
          </nav>
          <div className="ml-auto flex items-center gap-1.5">
            <NotificationBell />
            <TourTrigger autoOpen={isHome} />
            <LanguageSwitcher />
            <button
              onClick={toggle}
              className="h-9 w-9 rounded-lg flex items-center justify-center text-subtle hover:text-fg hover:bg-fg/[0.06]"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            {user ? (
              <Button size="sm" onClick={() => navigate(user.role === 'SUPER_ADMIN' ? '/superadmin' : '/app')}>
                {t('common.dashboard')}
              </Button>
            ) : (
              <>
                <Link to="/login"><Button variant="ghost" size="sm">{t('common.signIn')}</Button></Link>
                <Link to="/register">
                  <Button size="sm" iconRight={<ArrowRight className="h-4 w-4" />}>
                    {t('common.getStarted')}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border py-8 text-center text-xs text-subtle">
        <div className="flex items-center justify-center gap-2 mb-2">
          <BrandMark size={22} />
          <span className="font-medium">HireMind AI</span>
        </div>
        © {new Date().getFullYear()} HireMind AI · Built on Spring Boot + React
      </footer>
    </div>
  );
}
