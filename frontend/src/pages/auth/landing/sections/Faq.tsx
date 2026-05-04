import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useInView } from '@/lib/hooks';

interface FaqItem { q: string; a: string; }

export default function Faq() {
  const { t } = useTranslation();
  const [ref, inView] = useInView<HTMLDivElement>();
  const [open, setOpen] = useState<number | null>(0);
  const items = t('landing.faqs', { returnObjects: true }) as unknown as FaqItem[];

  return (
    <section className="max-w-3xl mx-auto px-6 py-24" ref={ref}>
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">{t('landing.faqTitle')}</h2>
        <p className="mt-3 text-subtle">{t('landing.faqSub')}</p>
      </div>

      <div className="rounded-2xl border border-border bg-surface divide-y divide-border overflow-hidden shadow-card">
        {items.map((it, i) => {
          const isOpen = open === i;
          return (
            <div
              key={i}
              className={`transition-all duration-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-fg/[0.02]"
              >
                <span className="font-medium text-fg pr-4">{it.q}</span>
                <ChevronDown className={`h-4 w-4 text-subtle shrink-0 transition-transform ${isOpen ? 'rotate-180 text-brand-500' : ''}`} />
              </button>
              <div
                className={`grid transition-all duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
              >
                <div className="overflow-hidden">
                  <div className="px-5 pb-5 text-sm text-subtle leading-relaxed">{it.a}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
