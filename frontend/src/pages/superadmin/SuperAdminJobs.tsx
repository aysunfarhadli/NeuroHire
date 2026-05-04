import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Briefcase } from 'lucide-react';
import { Card, Skeleton, Badge, Button } from '@/components/ui';
import { snapshot, setJobStatus, type JobRow } from '@/api/superadmin';

export default function SuperAdminJobs() {
  const { t } = useTranslation();
  const [jobs, setJobs] = useState<JobRow[] | null>(null);
  const [busy, setBusy] = useState<number | null>(null);

  useEffect(() => {
    snapshot().then((d) => setJobs(d.recentJobs)).catch(() => setJobs([]));
  }, []);

  const toggleStatus = async (j: JobRow, next: string, confirmKey?: string) => {
    if (confirmKey && !confirm(t(confirmKey))) return;
    setBusy(j.id);
    try {
      const updated = await setJobStatus(j.id, next);
      setJobs((arr) => arr ? arr.map((x) => (x.id === j.id ? updated : x)) : arr);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">{t('superAdmin.tabJobs')}</h1>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-subtle">
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Company</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">{t('common.status')}</th>
                <th className="px-4 py-3 font-medium text-right" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {!jobs && Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={6} className="p-3"><Skeleton className="h-5 w-2/3" /></td></tr>
              ))}
              {jobs?.map((j) => (
                <tr key={j.id} className="hover:bg-fg/[0.02]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                        <Briefcase className="h-4 w-4" />
                      </div>
                      <span className="font-medium">{j.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-subtle">{j.companyName}</td>
                  <td className="px-4 py-3 text-subtle">{j.location ?? '—'}</td>
                  <td className="px-4 py-3 text-subtle">{j.employmentType?.replace('_', ' ') ?? '—'}</td>
                  <td className="px-4 py-3">
                    <Badge tone={j.status === 'OPEN' ? 'green' : j.status === 'FLAGGED' ? 'red' : 'gray'}>
                      {j.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    {j.status === 'OPEN' && (
                      <>
                        <Button size="sm" variant="outline" loading={busy === j.id}
                          onClick={() => toggleStatus(j, 'FLAGGED', 'superAdmin.confirmFlag')}>
                          {t('superAdmin.flagJob')}
                        </Button>
                        <Button size="sm" variant="outline" loading={busy === j.id}
                          onClick={() => toggleStatus(j, 'CLOSED')}>
                          {t('superAdmin.closeJob')}
                        </Button>
                      </>
                    )}
                    {j.status === 'FLAGGED' && (
                      <Button size="sm" variant="outline" loading={busy === j.id}
                        onClick={() => toggleStatus(j, 'OPEN')}>
                        {t('superAdmin.unflagJob')}
                      </Button>
                    )}
                    {j.status === 'CLOSED' && (
                      <Button size="sm" variant="outline" loading={busy === j.id}
                        onClick={() => toggleStatus(j, 'OPEN')}>
                        {t('superAdmin.reopenJob')}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
