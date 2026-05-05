import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, Briefcase, BellRing, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/store/auth';
import { listNotifications, markAllRead, markRead, unreadCount, type NotificationItem } from '@/api/notifications';
import { relativeTime } from '@/lib/format';

const POLL_MS = 30_000;

function iconFor(type: string) {
  switch (type) {
    case 'APPLICATION_RECEIVED': return Briefcase;
    case 'APPLICATION_STAGE_CHANGED': return Activity;
    default: return BellRing;
  }
}

function titleKey(type: string) {
  switch (type) {
    case 'APPLICATION_RECEIVED': return 'notifications.typeApplicationReceived';
    case 'APPLICATION_STAGE_CHANGED': return 'notifications.typeApplicationStage';
    default: return 'notifications.typeGeneric';
  }
}

export default function NotificationBell() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[] | null>(null);
  const [unread, setUnread] = useState(0);
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    let alive = true;
    async function refresh() {
      try {
        const c = await unreadCount();
        if (alive) setUnread(c);
      } catch { /* network blip — ignore */ }
    }
    refresh();
    const id = window.setInterval(refresh, POLL_MS);
    return () => { alive = false; window.clearInterval(id); };
  }, [user]);

  useEffect(() => {
    if (!open || !user) return;
    listNotifications(15).then(setItems).catch(() => setItems([]));
  }, [open, user]);

  if (!user) return null;

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  async function onItemClick(n: NotificationItem) {
    setOpen(false);
    if (!n.read) {
      try {
        await markRead(n.id);
        setItems((arr) => arr?.map((x) => (x.id === n.id ? { ...x, read: true } : x)) ?? null);
        setUnread((u) => Math.max(0, u - 1));
      } catch { /* ignore */ }
    }
    if (n.link) navigate(n.link);
  }

  async function onMarkAll() {
    if (busy || unread === 0) return;
    setBusy(true);
    try {
      await markAllRead();
      setItems((arr) => arr?.map((x) => ({ ...x, read: true })) ?? null);
      setUnread(0);
    } catch { /* ignore */ } finally {
      setBusy(false);
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative h-9 w-9 rounded-lg flex items-center justify-center text-subtle hover:text-fg hover:bg-fg/[0.06]"
        aria-label={t('notifications.title')}
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-semibold flex items-center justify-center ring-2 ring-bg">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
        {unread > 0 && <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 animate-ping opacity-75" />}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-[min(360px,calc(100vw-2rem))] rounded-xl border border-border bg-surface shadow-pop z-50 overflow-hidden">
          <header className="px-4 py-3 border-b border-border flex items-center justify-between">
            <div className="font-semibold text-sm">{t('notifications.title')}</div>
            <button
              onClick={onMarkAll}
              disabled={unread === 0 || busy}
              className="inline-flex items-center gap-1 text-xs text-subtle hover:text-fg disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <CheckCheck className="h-3.5 w-3.5" /> {t('notifications.markAll')}
            </button>
          </header>

          <div className="max-h-[60vh] overflow-y-auto">
            {items === null ? (
              <ul className="divide-y divide-border">
                {Array.from({ length: 3 }).map((_, i) => (
                  <li key={i} className="p-3">
                    <div className="h-3 w-2/3 bg-fg/[0.06] rounded animate-pulse mb-1.5" />
                    <div className="h-2 w-1/3 bg-fg/[0.04] rounded animate-pulse" />
                  </li>
                ))}
              </ul>
            ) : items.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm text-subtle">
                <Bell className="h-5 w-5 mx-auto mb-2 opacity-40" />
                {t('notifications.empty')}
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {items.map((n) => {
                  const Icon = iconFor(n.type);
                  return (
                    <li key={n.id}>
                      <button
                        onClick={() => onItemClick(n)}
                        className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-fg/[0.03] transition-colors ${
                          !n.read ? 'bg-brand-500/[0.04]' : ''
                        }`}
                      >
                        <div className={`mt-0.5 h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                          n.type === 'APPLICATION_RECEIVED' ? 'bg-brand-500/10 text-brand-600 dark:text-brand-300'
                          : n.type === 'APPLICATION_STAGE_CHANGED' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-fg/[0.06] text-fg/70'
                        }`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <div className="text-[10px] uppercase tracking-wider font-semibold text-subtle">
                              {t(titleKey(n.type))}
                            </div>
                            {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />}
                          </div>
                          <div className="text-sm font-medium text-fg leading-tight mt-0.5 line-clamp-1">
                            {n.title}
                          </div>
                          {n.body && (
                            <div className="text-xs text-subtle mt-1 line-clamp-2">{n.body}</div>
                          )}
                          <div className="text-[11px] text-subtle/80 mt-1.5">{relativeTime(n.createdAt)}</div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {items && items.length > 0 && (
            <Link
              to="/app/applications"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-xs text-center text-brand-600 dark:text-brand-300 hover:bg-fg/[0.03] border-t border-border"
            >
              {t('notifications.seeAll')}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
