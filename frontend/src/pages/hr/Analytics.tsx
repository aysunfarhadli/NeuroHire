import { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Skeleton, StatTile } from '@/components/ui';
import { listJobs } from '@/api/jobs';
import type { JobPost } from '@/types/api';

export default function Analytics() {
  const [jobs, setJobs] = useState<JobPost[] | null>(null);

  useEffect(() => { listJobs().then(setJobs).catch(() => setJobs([])); }, []);

  if (jobs === null) {
    return <div className="space-y-4"><Skeleton className="h-32" /><Skeleton className="h-64" /></div>;
  }

  const open = jobs.filter((j) => j.status === 'OPEN').length;
  const senCounts = jobs.reduce<Record<string, number>>((acc, j) => {
    const k = j.seniority || 'UNSPECIFIED';
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
  const max = Math.max(1, ...Object.values(senCounts));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <p className="text-sm text-subtle mt-1">A quick read on your hiring pipeline health.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <StatTile label="Total jobs" value={jobs.length} accent="brand" />
        <StatTile label="Open positions" value={open} accent="green" />
        <StatTile label="Closed / draft" value={jobs.length - open} accent="amber" />
      </div>

      <Card>
        <CardHeader title="Jobs by seniority" subtitle="Distribution across your postings" />
        <CardBody className="space-y-3">
          {Object.entries(senCounts).map(([k, v]) => (
            <div key={k}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{k}</span>
                <span className="text-subtle">{v}</span>
              </div>
              <div className="h-2 bg-fg/[0.07] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-brand-500 to-violet-500" style={{ width: `${(v / max) * 100}%` }} />
              </div>
            </div>
          ))}
          {Object.keys(senCounts).length === 0 && (
            <div className="text-sm text-subtle text-center py-4">No data yet — create some jobs first.</div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
