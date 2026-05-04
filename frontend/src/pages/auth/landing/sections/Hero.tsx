import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui';

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="app-mesh relative">
      <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-24 text-center relative">
        <div className="inline-flex items-center gap-2 px-3 h-8 rounded-full bg-brand-500/10 text-brand-700 dark:text-brand-300 text-xs font-medium mb-7 ring-1 ring-brand-500/20 animate-fade-in-up">
          <Sparkles className="h-3.5 w-3.5" />
          {t('landing.badge')}
          <span className="w-px h-4 bg-brand-500/30" />
          <span>v0.1 · MVP</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05] animate-fade-in-up">
          {t('landing.headline1')} <br className="hidden sm:block" />
          <span className="gradient-text">{t('landing.headline2')}</span> <span>{t('landing.headline3')}</span>
        </h1>

        <p className="mt-7 text-lg md:text-xl text-subtle max-w-2xl mx-auto leading-relaxed animate-fade-in-up">
          {t('landing.sub')}
        </p>

        <div className="mt-10 flex items-center justify-center gap-3 flex-wrap animate-fade-in-up">
          <Link to="/register">
            <Button size="lg" iconRight={<ArrowRight className="h-4 w-4" />}>
              {t('landing.startFree')}
            </Button>
          </Link>
          <Link to="/jobs">
            <Button size="lg" variant="outline">{t('common.browseJobs')}</Button>
          </Link>
        </div>

        <div className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-subtle">
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-brand-500" /> {t('landing.bullets.noCard')}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-brand-500" /> {t('landing.bullets.selfHosted')}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-brand-500" /> {t('landing.bullets.biasGuard')}
          </span>
        </div>
      </div>
    </section>
  );
}
