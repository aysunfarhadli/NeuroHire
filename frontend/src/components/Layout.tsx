import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  KanbanSquare,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react';
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

  return (
    <div className="min-h-screen flex bg-bg">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-border bg-surface relative">
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-brand-500/10 to-transparent pointer-events-none" />
        <div className="relative h-16 px-5 flex items-center gap-2.5 border-b border-border">
          <BrandMark size={32} />
          <div>
            <div className="text-sm font-semibold text-fg leading-none">
              HireMind <span className="gradient-text">AI</span>
            </div>
            <div className="text-[10px] uppercase tracking-wider text-subtle mt-1">HR decision support</div>
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
                    ? 'bg-gradient-to-r from-brand-500/15 to-brand-500/5 text-brand-700 dark:text-brand-300 font-medium ring-1 ring-brand-500/20'
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
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border glass sticky top-0 z-20 flex items-center justify-between px-6">
          <div className="text-sm text-subtle">
            <span className="text-fg font-medium">{user?.role.replace('_', ' ')}</span>
            {user?.companyId && <span className="ml-2">· Company #{user.companyId}</span>}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="h-9 w-9 rounded-lg flex items-center justify-center text-subtle hover:text-fg hover:bg-fg/[0.06]"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={() => navigate('/app/settings')}
              className="h-9 w-9 rounded-lg flex items-center justify-center text-subtle hover:text-fg hover:bg-fg/[0.06]"
              aria-label="Settings"
            >
              <Settings className="h-4 w-4" />
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
