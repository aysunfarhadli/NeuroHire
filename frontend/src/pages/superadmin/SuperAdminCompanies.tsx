import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, ExternalLink } from 'lucide-react';
import { Card, Skeleton, Badge } from '@/components/ui';
import { snapshot, type CompanyRow } from '@/api/superadmin';

export default function SuperAdminCompanies() {
  const { t } = useTranslation();
  const [companies, setCompanies] = useState<CompanyRow[] | null>(null);

  useEffect(() => {
    snapshot().then((d) => setCompanies(d.companies)).catch(() => setCompanies([]));
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">{t('superAdmin.tabCompanies')}</h1>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-subtle">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">{t('companiesPublic.industry')}</th>
                <th className="px-4 py-3 font-medium">{t('companiesPublic.plan')}</th>
                <th className="px-4 py-3 font-medium">Open jobs</th>
                <th className="px-4 py-3 font-medium">Website</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {!companies && Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={5} className="p-3"><Skeleton className="h-5 w-2/3" /></td></tr>
              ))}
              {companies?.map((c) => (
                <tr key={c.id} className="hover:bg-fg/[0.02]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <span className="font-medium">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-subtle">{c.industry ?? '—'}</td>
                  <td className="px-4 py-3">{c.subscriptionPlan && <Badge tone="violet">{c.subscriptionPlan}</Badge>}</td>
                  <td className="px-4 py-3"><Badge tone="blue">{c.jobCount}</Badge></td>
                  <td className="px-4 py-3">
                    {c.website && (
                      <a href={c.website} target="_blank" rel="noreferrer noopener" className="text-brand-600 dark:text-brand-300 hover:underline inline-flex items-center gap-1">
                        Open <ExternalLink className="h-3 w-3" />
                      </a>
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
