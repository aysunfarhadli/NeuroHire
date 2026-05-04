import { useEffect, useState } from 'react';
import { Users, Briefcase, Building2, ShieldCheck, UserCheck, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardBody, StatTile, Skeleton, Badge } from '@/components/ui';
import { snapshot, type DashboardSnapshot } from '@/api/superadmin';

export default function SuperAdminDashboard() {
  const { t } = useTranslation();
  const [data, setData] = useState<DashboardSnapshot | null>(null);

  useEffect(() => {
    snapshot().then(setData).catch(() => setData(null));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-red-500" />
          {t('superAdmin.title')}
        </h1>
        <p className="mt-1 text-sm text-subtle">{t('superAdmin.sub')}</p>
      </div>

      {!data && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      )}

      {data && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <StatTile label={t('superAdmin.metrics.users')}      value={data.metrics.totalUsers}      accent="brand" />
          <StatTile label={t('superAdmin.metrics.candidates')} value={data.metrics.totalCandidates} accent="brand" />
          <StatTile label={t('superAdmin.metrics.recruiters')} value={data.metrics.totalRecruiters} accent="brand" />
          <StatTile label={t('superAdmin.metrics.companies')}  value={data.metrics.totalCompanies}  accent="green" />
          <StatTile label={t('superAdmin.metrics.jobs')}       value={data.metrics.totalJobs}       accent="amber" />
          <StatTile label={t('superAdmin.metrics.openJobs')}   value={data.metrics.openJobs}        accent="green" />
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader title={t('superAdmin.tabUsers')} subtitle={data ? `${data.recentUsers.length} recent` : ''} />
          <CardBody className="p-0">
            <ul className="divide-y divide-border">
              {!data && Array.from({ length: 5 }).map((_, i) => (
                <li key={i} className="p-3"><Skeleton className="h-4 w-2/3" /></li>
              ))}
              {data?.recentUsers.map((u) => (
                <li key={u.id} className="p-3 flex items-center gap-3">
                  <div className="h-9 w-9 shrink-0 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-300 flex items-center justify-center font-semibold text-xs">
                    {u.fullName.split(' ').map((p) => p[0]).slice(0, 2).join('')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">{u.fullName}</div>
                    <div className="text-xs text-subtle truncate">{u.email}</div>
                  </div>
                  <Badge tone={u.role === 'SUPER_ADMIN' ? 'red' : u.role === 'CANDIDATE' ? 'blue' : 'violet'}>
                    {u.role}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title={t('superAdmin.tabCompanies')} subtitle={data ? `${data.companies.length} total` : ''} />
          <CardBody className="p-0">
            <ul className="divide-y divide-border">
              {!data && Array.from({ length: 5 }).map((_, i) => (
                <li key={i} className="p-3"><Skeleton className="h-4 w-2/3" /></li>
              ))}
              {data?.companies.map((c) => (
                <li key={c.id} className="p-3 flex items-center gap-3">
                  <div className="h-9 w-9 shrink-0 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">{c.name}</div>
                    <div className="text-xs text-subtle truncate">{c.industry ?? '—'}</div>
                  </div>
                  <Badge tone="blue">
                    <Briefcase className="h-3 w-3" />{c.jobCount}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title={t('superAdmin.tabJobs')} subtitle={data ? `${data.recentJobs.length} recent` : ''} />
          <CardBody className="p-0">
            <ul className="divide-y divide-border">
              {!data && Array.from({ length: 5 }).map((_, i) => (
                <li key={i} className="p-3"><Skeleton className="h-4 w-2/3" /></li>
              ))}
              {data?.recentJobs.map((j) => (
                <li key={j.id} className="p-3 flex items-center gap-3">
                  <div className="h-9 w-9 shrink-0 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">{j.title}</div>
                    <div className="text-xs text-subtle truncate">{j.companyName}</div>
                  </div>
                  <Badge tone={j.status === 'OPEN' ? 'green' : j.status === 'FLAGGED' ? 'red' : 'gray'}>
                    {j.status}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader
          title={(<span className="inline-flex items-center gap-2"><Activity className="h-4 w-4" /> Quick health</span>)}
          subtitle="Real-time platform vitals"
        />
        <CardBody>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <UserCheck className="h-4 w-4" />
              </div>
              <div>
                <div className="font-medium">Active candidates</div>
                <div className="text-subtle">{data?.metrics.totalCandidates ?? '—'} signed up</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <div className="font-medium">Recruiters online</div>
                <div className="text-subtle">{data?.metrics.totalRecruiters ?? '—'} accounts</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Briefcase className="h-4 w-4" />
              </div>
              <div>
                <div className="font-medium">Open jobs</div>
                <div className="text-subtle">{data?.metrics.openJobs ?? '—'} of {data?.metrics.totalJobs ?? '—'}</div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
