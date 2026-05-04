import { useEffect, useState } from 'react';
import { Compass } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import OnboardingTour from './OnboardingTour';

const TOUR_KEY = 'hm_tour_seen_v1';

export default function TourTrigger({ autoOpen = false }: { autoOpen?: boolean }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!autoOpen) return;
    if (typeof window === 'undefined') return;
    if (localStorage.getItem(TOUR_KEY) === '1') return;
    const id = setTimeout(() => setOpen(true), 900);
    return () => clearTimeout(id);
  }, [autoOpen]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="h-9 px-2.5 rounded-lg flex items-center gap-1.5 text-sm text-subtle hover:text-fg hover:bg-fg/[0.06] border border-transparent hover:border-border"
        aria-label={t('tour.open')}
      >
        <Compass className="h-4 w-4" />
        <span className="hidden sm:inline font-medium">{t('tour.open')}</span>
      </button>
      <OnboardingTour open={open} onClose={() => setOpen(false)} />
    </>
  );
}
