import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Building2, ExternalLink, Briefcase, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, Skeleton, EmptyState, Badge, Button } from '@/components/ui';
import { getPublicCompany } from '@/api/companies';
import { searchPublicJobs } from '@/api/jobs';
import type { Company, JobPost } from '@/types/api';

export default function CompanyProfile() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getPublicCompany(Number(id))
      .then((c) => { setCompany(c); return searchPublicJobs({}); })
      .then((js) => setJobs(js.filter((j) => j.companyId === Number(id))))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10">
        <Skeleton className="h-8 w-2/3 mb-3" />
        <Skeleton className="h-4 w-1/3 mb-8" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (notFound || !company) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-semibold">{t('common.notFoundTitle')}</h1>
        <p className="mt-2 text-subtle">{t('common.notFoundBody')}</p>
        <Link to="/companies" className="inline-block mt-6">
          <Button variant="outline" iconLeft={<ArrowLeft className="h-4 w-4" />}>{t('common.companies')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <Link to="/companies" className="inline-flex items-center gap-1.5 text-sm text-subtle hover:text-fg mb-6">
        <ArrowLeft className="h-4 w-4" /> {t('common.companies')}
      </Link>

      <Card className="p-7">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-brand-500/15 to-sky-400/10 ring-1 ring-brand-500/20 flex items-center justify-center text-brand-600 dark:text-brand-300 shrink-0">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{company.name}</h1>
              <div className="mt-1 text-sm text-subtle flex flex-wrap items-center gap-x-3 gap-y-1">
                {company.industry && <span>{company.industry}</span>}
                {company.subscriptionPlan && <Badge tone="violet">{company.subscriptionPlan}</Badge>}
              </div>
            </div>
          </div>
          {company.website && (
            <a
              href={company.website}
              target="_blank"
              rel="noreferrer noopener"
              className="text-sm text-brand-600 dark:text-brand-300 hover:underline inline-flex items-center gap-1"
            >
              {t('companiesPublic.visitWebsite')} <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
        {company.description && (
          <div className="mt-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-subtle mb-2">
              {t('companiesPublic.aboutTitle')}
            </h2>
            <p className="text-fg leading-relaxed">{company.description}</p>
          </div>
        )}
      </Card>

      <div className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-subtle mb-3 flex items-center gap-2">
          <Briefcase className="h-4 w-4" /> {t('companiesPublic.openings')}
        </h2>
        {jobs.length === 0 ? (
          <EmptyState title={t('companiesPublic.noOpenings')} />
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {jobs.map((j) => (
              <Link key={j.id} to={`/jobs/${j.id}`} className="group">
                <Card hover className="p-5">
                  <h3 className="font-semibold text-fg group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors">
                    {j.title}
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-subtle">
                    {j.location && (
                      <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {j.location}</span>
                    )}
                    {j.employmentType && <Badge tone="blue">{j.employmentType.replace('_', ' ')}</Badge>}
                    {j.seniority && <Badge tone="violet">{j.seniority}</Badge>}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
