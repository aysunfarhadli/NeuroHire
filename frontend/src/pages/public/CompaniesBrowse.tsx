import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, ArrowRight, Briefcase } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, Skeleton, Badge } from '@/components/ui';
import { listPublicCompanies } from '@/api/companies';
import { searchPublicJobs } from '@/api/jobs';
import type { Company, JobPost } from '@/types/api';

export default function CompaniesBrowse() {
  const { t } = useTranslation();
  const [companies, setCompanies] = useState<Company[] | null>(null);
  const [jobs, setJobs] = useState<JobPost[]>([]);

  useEffect(() => {
    Promise.all([listPublicCompanies(), searchPublicJobs({})])
      .then(([cs, js]) => { setCompanies(cs); setJobs(js); })
      .catch(() => setCompanies([]));
  }, []);

  const jobsByCompany = jobs.reduce<Record<number, number>>((acc, j) => {
    acc[j.companyId] = (acc[j.companyId] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">{t('companiesPublic.title')}</h1>
        <p className="mt-3 text-subtle max-w-xl mx-auto">{t('companiesPublic.sub')}</p>
      </div>

      {!companies && (
        <div className="grid md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-5"><Skeleton className="h-5 w-2/3 mb-3" /><Skeleton className="h-3 w-1/2" /></Card>
          ))}
        </div>
      )}

      {companies && (
        <div className="grid md:grid-cols-3 gap-5">
          {companies.map((c) => {
            const jobCount = jobsByCompany[c.id] ?? 0;
            return (
              <Link key={c.id} to={`/companies/${c.id}`} className="group">
                <Card hover className="p-6 h-full">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-brand-500/15 to-sky-400/10 ring-1 ring-brand-500/20 flex items-center justify-center text-brand-600 dark:text-brand-300 mb-4">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-fg group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors">
                    {c.name}
                  </h3>
                  {c.industry && <div className="mt-0.5 text-sm text-subtle">{c.industry}</div>}
                  {c.description && <p className="mt-3 text-sm text-subtle line-clamp-2">{c.description}</p>}
                  <div className="mt-4 flex items-center justify-between text-xs">
                    <Badge tone="blue">
                      <Briefcase className="h-3 w-3" />
                      {t('companiesPublic.openJobs', { count: jobCount })}
                    </Badge>
                    <span className="inline-flex items-center gap-1 text-brand-600 dark:text-brand-300 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      {t('common.seeMore')} <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
