import { useTranslation } from 'react-i18next';
import { Building2, Cloud, Heart, Banknote, Tv, Bot } from 'lucide-react';
import { useInView } from '@/lib/hooks';

const COMPANIES = [
  { name: 'HireMind AI',     icon: Building2 },
  { name: 'Nimbus Cloud',    icon: Cloud },
  { name: 'Verdant Health',  icon: Heart },
  { name: 'Atlas Financial', icon: Banknote },
  { name: 'Orbit Media',     icon: Tv },
  { name: 'Kinetix Robotics',icon: Bot },
];

export default function TrustedBy() {
  const { t } = useTranslation();
  const [ref, inView] = useInView<HTMLDivElement>();

  return (
    <section ref={ref} className="border-y border-border bg-fg/[0.015]">
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-14 text-center">
        <div className="text-[11px] uppercase tracking-[0.2em] text-subtle font-medium">
          {t('landing.trustedByTitle')}
        </div>
        <div className="mt-1 text-sm text-subtle">{t('landing.trustedBySub')}</div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-6 gap-x-8 gap-y-6 items-center">
          {COMPANIES.map((c, i) => (
            <div
              key={c.name}
              className={`inline-flex items-center justify-center gap-2 text-fg/70 hover:text-fg transition-all duration-700 grayscale hover:grayscale-0 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <c.icon className="h-5 w-5 shrink-0" />
              <span className="text-sm font-semibold tracking-tight whitespace-nowrap">{c.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
