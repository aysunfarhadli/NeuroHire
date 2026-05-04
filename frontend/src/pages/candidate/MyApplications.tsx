import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ArrowRight, X, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardBody, CardHeader, EmptyState, Skeleton, Badge, Button, Toast } from '@/components/ui';
import { myApplications, withdrawApplication, type MyApplication } from '@/api/applications';
import { apiErrorMessage } from '@/api/client';
import { relativeTime } from '@/lib/format';
import type { PipelineStage } from '@/types/api';

const STAGE_TONE: Record<PipelineStage, 'gray' | 'green' | 'amber' | 'blue' | 'violet' | 'red'> = {
  NEW: 'blue',
  REVIEWED: 'violet',
  SHORTLISTED: 'amber',
  INTERVIEW: 'amber',
  OFFER: 'green',
  HIRED: 'green',
  REJECTED: 'red',
};

export default function MyApplications() {
  const { t } = useTranslation();
  const [apps, setApps] = useState<MyApplication[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try { setApps(await myApplications()); } catch (e) { setError(apiErrorMessage(e)); }
  }
  useEffect(() => { load(); }, []);

  async function onWithdraw(id: number) {
    if (!confirm(t('applications.withdrawConfirm'))) return;
    try { await withdrawApplication(id); await load(); } catch (e) { setError(apiErrorMessage(e)); }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t('applications.title')}</h1>
        <p className="text-sm text-subtle mt-1">{t('applications.sub')}</p>
      </div>

      {error && <Toast kind="error">{error}</Toast>}

      <Card>
        <CardHeader title={t('applications.title')} subtitle={apps ? `${apps.length} total` : ''} />
        <CardBody className="p-0">
          {apps === null ? (
            <div className="p-5 space-y-3">
              <Skeleton className="h-12" /><Skeleton className="h-12" /><Skeleton className="h-12" />
            </div>
          ) : apps.length === 0 ? (
            <EmptyState
              icon={<Briefcase className="h-6 w-6" />}
              title={t('applications.empty')}
              action={<Link to="/jobs"><Button iconRight={<ArrowRight className="h-4 w-4" />}>{t('applications.emptyCta')}</Button></Link>}
            />
          ) : (
            <ul className="divide-y divide-border">
              {apps.map((a) => (
                <li key={a.id} className="flex items-center gap-4 px-5 py-4 hover:bg-fg/[0.02] transition-colors">
                  <div className="h-10 w-10 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-300 flex items-center justify-center shrink-0">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link to={`/jobs/${a.jobId}`} className="font-medium hover:text-brand-600 dark:hover:text-brand-300 inline-flex items-center gap-1.5">
                      {a.jobTitle}
                      <ExternalLink className="h-3 w-3 opacity-60" />
                    </Link>
                    <div className="text-xs text-subtle mt-0.5">
                      {a.companyName} · {t('applications.appliedOn', { when: relativeTime(a.appliedAt) })}
                    </div>
                  </div>
                  <Badge tone={STAGE_TONE[a.stage]}>{a.stage}</Badge>
                  {a.stage === 'NEW' && (
                    <button
                      onClick={() => onWithdraw(a.id)}
                      className="h-8 w-8 rounded-md hover:bg-red-500/10 text-subtle hover:text-red-500 flex items-center justify-center"
                      aria-label={t('applications.withdraw')}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
