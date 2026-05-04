import { Upload, Brain, Workflow } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useInView } from '@/lib/hooks';

export default function HowItWorks() {
  const { t } = useTranslation();
  const [ref, inView] = useInView<HTMLDivElement>();

  const steps = [
    { icon: Upload,   key: 'step1' },
    { icon: Brain,    key: 'step2' },
    { icon: Workflow, key: 'step3' },
  ] as const;

  return (
    <section className="max-w-6xl mx-auto px-6 py-24" ref={ref}>
      <div className="text-center max-w-2xl mx-auto mb-14">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
          {t('landing.howItWorksTitle')}
        </h2>
        <p className="mt-3 text-subtle">{t('landing.howItWorksSub')}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-5 relative">
        {/* connecting line */}
        <div className="hidden md:block absolute top-9 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        {steps.map((s, i) => (
          <div
            key={s.key}
            className={`relative rounded-xl2 border border-border bg-surface p-7 shadow-card text-center transition-all duration-700 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: `${i * 120}ms` }}
          >
            <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center mb-4 shadow-glow">
              <s.icon className="h-6 w-6" />
            </div>
            <div className="absolute top-4 right-4 text-[10px] font-mono text-subtle">0{i + 1}</div>
            <h3 className="font-semibold tracking-tight text-lg">{t(`landing.${s.key}Title`)}</h3>
            <p className="mt-2 text-sm text-subtle leading-relaxed">{t(`landing.${s.key}Body`)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
