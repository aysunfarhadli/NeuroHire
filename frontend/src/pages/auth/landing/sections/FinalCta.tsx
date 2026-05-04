import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui';

export default function FinalCta() {
  const { t } = useTranslation();
  return (
    <section className="max-w-4xl mx-auto px-6 py-24 text-center">
      <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">
        {t('landing.ctaTitle1')} <span className="gradient-text">{t('landing.ctaTitle2')}</span>
      </h2>
      <p className="mt-4 text-subtle max-w-xl mx-auto">{t('landing.ctaSub')}</p>
      <div className="mt-8 flex justify-center gap-3 flex-wrap">
        <Link to="/register">
          <Button size="lg" iconRight={<ArrowRight className="h-4 w-4" />}>{t('common.createAccount')}</Button>
        </Link>
        <Link to="/jobs">
          <Button size="lg" variant="outline">{t('common.browseJobs')}</Button>
        </Link>
      </div>
      <div className="mt-7 inline-flex flex-col sm:flex-row gap-2 sm:gap-x-4 text-xs text-subtle px-4 py-3 rounded-xl bg-fg/[0.04] border border-border">
        <div className="font-semibold text-fg">{t('landing.demoCreds')}:</div>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <span><span className="font-mono text-fg">super@hiremind.ai</span> · Super123!</span>
          <span><span className="font-mono text-fg">hr@hiremind.ai</span> · Hr123456!</span>
          <span><span className="font-mono text-fg">candidate@hiremind.ai</span> · Cand123!</span>
        </div>
      </div>
    </section>
  );
}
