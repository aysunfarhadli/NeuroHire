import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, Layers, X, ArrowRight, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button, Card, EmptyState, Skeleton, Badge } from '@/components/ui';
import { searchPublicJobs } from '@/api/jobs';
import { listPublicCompanies } from '@/api/companies';
import type { Company, JobPost } from '@/types/api';

const TYPES = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP'];
const LEVELS = ['JUNIOR', 'MID', 'SENIOR'];

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return 'today';
  if (d === 1) return '1d ago';
  if (d < 30) return `${d}d ago`;
  return `${Math.floor(d / 30)}mo ago`;
}

export default function JobsBrowse() {
  const { t } = useTranslation();
  const [q, setQ] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [level, setLevel] = useState('');
  const [jobs, setJobs] = useState<JobPost[] | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    listPublicCompanies().then(setCompanies).catch(() => setCompanies([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    const handle = setTimeout(() => {
      searchPublicJobs({ q, location, employmentType: type, seniority: level })
        .then(setJobs)
        .catch(() => setJobs([]))
        .finally(() => setLoading(false));
    }, 220);
    return () => clearTimeout(handle);
  }, [q, location, type, level]);

  const companyById = useMemo(() => {
    const m = new Map<number, Company>();
    companies.forEach((c) => m.set(c.id, c));
    return m;
  }, [companies]);

  const clearAll = () => {
    setQ(''); setLocation(''); setType(''); setLevel('');
  };
  const hasFilters = !!(q || location || type || level);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 h-7 rounded-full bg-brand-500/10 text-brand-700 dark:text-brand-300 text-xs font-medium mb-4">
          <Sparkles className="h-3 w-3" /> {t('common.appName')}
        </div>
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
          {t('jobsPublic.title')}
        </h1>
        <p className="mt-3 text-subtle max-w-xl mx-auto">{t('jobsPublic.sub')}</p>
      </div>

      <Card className="p-3 md:p-4 mb-6">
        <div className="grid md:grid-cols-12 gap-2">
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-subtle pointer-events-none" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t('jobsPublic.searchPlaceholder')}
              className="w-full h-11 pl-10 pr-3 rounded-lg bg-bg/60 border border-border text-fg placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
            />
          </div>
          <div className="md:col-span-3 relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-subtle pointer-events-none" />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={t('jobsPublic.locationPlaceholder')}
              className="w-full h-11 pl-10 pr-3 rounded-lg bg-bg/60 border border-border text-fg placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
            />
          </div>
          <div className="md:col-span-2 relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-subtle pointer-events-none" />
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full h-11 pl-10 pr-3 rounded-lg bg-bg/60 border border-border text-fg focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
            >
              <option value="">{t('jobsPublic.anyType')}</option>
              {TYPES.map((tp) => (
                <option key={tp} value={tp}>
                  {tp.replace('_', ' ').toLowerCase().replace(/^./, (c) => c.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2 relative">
            <Layers className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-subtle pointer-events-none" />
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full h-11 pl-10 pr-3 rounded-lg bg-bg/60 border border-border text-fg focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
            >
              <option value="">{t('jobsPublic.anyLevel')}</option>
              {LEVELS.map((lv) => (
                <option key={lv} value={lv}>{lv.charAt(0) + lv.slice(1).toLowerCase()}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-subtle">
          {loading
            ? t('common.loading')
            : t('jobsPublic.resultsCount', { count: jobs?.length ?? 0 })}
        </div>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-subtle hover:text-fg inline-flex items-center gap-1"
          >
            <X className="h-3 w-3" /> {t('jobsPublic.clearFilters')}
          </button>
        )}
      </div>

      {loading && (
        <div className="grid md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-5">
              <Skeleton className="h-5 w-2/3 mb-3" />
              <Skeleton className="h-3 w-1/3 mb-4" />
              <Skeleton className="h-3 w-full mb-1.5" />
              <Skeleton className="h-3 w-5/6" />
            </Card>
          ))}
        </div>
      )}

      {!loading && jobs && jobs.length === 0 && (
        <EmptyState
          icon={<Search className="h-6 w-6" />}
          title={t('jobsPublic.noResults')}
          action={hasFilters ? (
            <Button variant="outline" onClick={clearAll}>{t('jobsPublic.clearFilters')}</Button>
          ) : undefined}
        />
      )}

      {!loading && jobs && jobs.length > 0 && (
        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map((j) => {
            const company = companyById.get(j.companyId);
            return (
              <Link key={j.id} to={`/jobs/${j.id}`} className="group">
                <Card hover className="p-5 h-full flex flex-col">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="font-semibold text-fg leading-tight group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors">
                        {j.title}
                      </h3>
                      <div className="mt-1 text-sm text-subtle">
                        {company?.name ?? `Company #${j.companyId}`}
                        {company?.industry && <span> · {company.industry}</span>}
                      </div>
                    </div>
                    {j.seniority && <Badge tone="violet">{j.seniority}</Badge>}
                  </div>
                  <p className="text-sm text-subtle line-clamp-2 mb-3">{j.description}</p>
                  <div className="mt-auto flex flex-wrap items-center gap-2 text-xs text-subtle">
                    {j.location && (
                      <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {j.location}</span>
                    )}
                    {j.employmentType && <Badge tone="blue">{j.employmentType.replace('_', ' ')}</Badge>}
                    <span className="ml-auto inline-flex items-center gap-1 text-brand-600 dark:text-brand-300 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      {t('jobsPublic.viewDetails')} <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                  <div className="mt-2 text-[11px] text-subtle">{t('jobsPublic.posted')} {timeAgo(j.createdAt)}</div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
