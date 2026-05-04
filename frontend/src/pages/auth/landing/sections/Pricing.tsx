import { Link } from 'react-router-dom';
import { Check, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui';
import { useInView } from '@/lib/hooks';

interface Tier {
  key: 'Free' | 'Pro' | 'Ent';
  price: string | number;
  featured?: boolean;
  features: string[];
  ctaTo: string;
  ctaKey: 'pricingCta' | 'pricingContact';
}

export default function Pricing() {
  const { t } = useTranslation();
  const [ref, inView] = useInView<HTMLDivElement>();

  const tiers: Tier[] = [
    {
      key: 'Free',
      price: 0,
      features: ['pricingFreeF1', 'pricingFreeF2', 'pricingFreeF3', 'pricingFreeF4'],
      ctaTo: '/register',
      ctaKey: 'pricingCta',
    },
    {
      key: 'Pro',
      price: 49,
      featured: true,
      features: ['pricingProF1', 'pricingProF2', 'pricingProF3', 'pricingProF4', 'pricingProF5'],
      ctaTo: '/register',
      ctaKey: 'pricingCta',
    },
    {
      key: 'Ent',
      price: t('landing.pricingCustom'),
      features: ['pricingEntF1', 'pricingEntF2', 'pricingEntF3', 'pricingEntF4', 'pricingEntF5'],
      ctaTo: 'mailto:sales@hiremind.ai',
      ctaKey: 'pricingContact',
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 py-24" ref={ref}>
      <div className="text-center max-w-2xl mx-auto mb-14">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">{t('landing.pricingTitle')}</h2>
        <p className="mt-3 text-subtle">{t('landing.pricingSub')}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-5 items-stretch">
        {tiers.map((tier, i) => {
          const isFeatured = !!tier.featured;
          return (
            <div
              key={tier.key}
              className={`relative rounded-2xl border bg-surface p-7 transition-all duration-700 ${
                isFeatured
                  ? 'border-brand-500/40 shadow-glow ring-1 ring-brand-500/30 md:-translate-y-3'
                  : 'border-border shadow-card'
              } ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {isFeatured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2.5 h-6 rounded-full bg-gradient-to-r from-brand-500 to-brand-700 text-white shadow-glow">
                  <Sparkles className="h-3 w-3" /> {t('landing.popular')}
                </div>
              )}

              <div className="text-sm font-semibold uppercase tracking-wider text-subtle">
                {t(`landing.pricing${tier.key}Name`)}
              </div>
              <div className="mt-4 flex items-baseline gap-1">
                {typeof tier.price === 'number' ? (
                  <>
                    <span className="text-5xl font-semibold tracking-tight">${tier.price}</span>
                    {tier.price > 0 && <span className="text-sm text-subtle">{t('landing.pricingMonth')}</span>}
                  </>
                ) : (
                  <span className="text-5xl font-semibold tracking-tight">{tier.price}</span>
                )}
              </div>
              <p className="mt-3 text-sm text-subtle min-h-[40px]">{t(`landing.pricing${tier.key}Body`)}</p>

              <ul className="mt-6 space-y-2.5">
                {tier.features.map((fk) => (
                  <li key={fk} className="flex items-start gap-2.5 text-sm">
                    <span className={`mt-0.5 h-4 w-4 rounded-full flex items-center justify-center shrink-0 ${
                      isFeatured ? 'bg-brand-500/20 text-brand-600 dark:text-brand-300' : 'bg-fg/[0.07] text-fg/70'
                    }`}>
                      <Check className="h-3 w-3" />
                    </span>
                    <span className="text-fg/90">{t(`landing.${fk}`)}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7">
                {tier.ctaTo.startsWith('mailto:') ? (
                  <a href={tier.ctaTo} className="block">
                    <Button variant={isFeatured ? 'primary' : 'outline'} className="w-full">
                      {t(`landing.${tier.ctaKey}`)}
                    </Button>
                  </a>
                ) : (
                  <Link to={tier.ctaTo} className="block">
                    <Button variant={isFeatured ? 'primary' : 'outline'} className="w-full">
                      {t(`landing.${tier.ctaKey}`)}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
