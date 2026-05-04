import { useEffect, useRef, useState } from 'react';
import { Globe, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '@/i18n';

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const current = SUPPORTED_LANGUAGES.find((l) => l.code === i18n.language) ?? SUPPORTED_LANGUAGES[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="h-9 px-2.5 rounded-lg flex items-center gap-1.5 text-sm text-subtle hover:text-fg hover:bg-fg/[0.06] border border-transparent hover:border-border"
        aria-label={t('common.language')}
      >
        <Globe className="h-4 w-4" />
        {!compact && <span className="font-medium tabular-nums">{current.short}</span>}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 min-w-[180px] rounded-lg border border-border bg-surface shadow-pop py-1 z-50">
          {SUPPORTED_LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                i18n.changeLanguage(l.code);
                setOpen(false);
              }}
              className={`w-full px-3 h-9 flex items-center justify-between text-sm hover:bg-fg/[0.05] ${
                l.code === current.code ? 'text-fg font-medium' : 'text-subtle'
              }`}
            >
              <span>{l.label}</span>
              {l.code === current.code && <Check className="h-4 w-4 text-brand-500" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
