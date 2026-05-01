import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, KanbanSquare, Plus, Users } from 'lucide-react';
import { Badge, Button, Card, CardBody, CardHeader, EmptyState, Skeleton, StatTile } from '@/components/ui';
import { listJobs } from '@/api/jobs';
import type { JobPost } from '@/types/api';
import { relativeTime } from '@/lib/format';

export default function HrDashboard() {
  const [jobs, setJobs] = useState<JobPost[] | null>(null);

  useEffect(() => { listJobs().then(setJobs).catch(() => setJobs([])); }, []);

  const open = jobs?.filter((j) => j.status === 'OPEN') ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">HR Dashboard</h1>
          <p className="text-sm text-subtle mt-1">All your hiring activity at a glance.</p>
        </div>
        <Link to="/app/jobs/new"><Button iconLeft={<Plus className="h-4 w-4" />}>New job</Button></Link>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <StatTile label="Total jobs" value={jobs?.length ?? '—'} accent="brand" />
        <StatTile label="Open positions" value={open.length} accent="green" />
        <StatTile label="Last update" value={jobs?.[0] ? relativeTime(jobs[0].updatedAt) : '—'} accent="amber" />
      </div>

      <Card>
        <CardHeader
          title="Recent jobs"
          subtitle="Click into a job to see ranked candidates"
          action={<Link to="/app/jobs"><Button variant="ghost" size="sm" iconRight={<ArrowRight className="h-4 w-4" />}>View all</Button></Link>}
        />
        <CardBody className="p-0">
          {jobs === null ? (
            <div className="p-5 space-y-3"><Skeleton className="h-12" /><Skeleton className="h-12" /></div>
          ) : jobs.length === 0 ? (
            <EmptyState icon={<Briefcase className="h-6 w-6" />} title="No jobs yet"
              description="Create your first job to start screening candidates with AI."
              action={<Link to="/app/jobs/new"><Button iconLeft={<Plus className="h-4 w-4" />}>Create job</Button></Link>} />
          ) : (
            <ul className="divide-y divide-border">
              {jobs.slice(0, 6).map((j) => (
                <li key={j.id}>
                  <Link to={`/app/jobs/${j.id}`} className="flex items-center justify-between px-5 py-3.5 hover:bg-fg/[0.03]">
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{j.title}</div>
                      <div className="text-xs text-subtle mt-0.5">
                        {j.location && <>{j.location} · </>}
                        Updated {relativeTime(j.updatedAt)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {j.seniority && <Badge tone="violet">{j.seniority}</Badge>}
                      <Badge tone={j.status === 'OPEN' ? 'green' : 'gray'}>{j.status}</Badge>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card hover>
          <CardBody>
            <div className="h-9 w-9 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-3">
              <Users className="h-4 w-4" />
            </div>
            <h3 className="font-semibold">Candidates</h3>
            <p className="text-sm text-subtle mt-1">Browse all uploaded CVs and analyze any candidate against any job.</p>
            <Link to="/app/candidates" className="mt-3 inline-flex items-center gap-1.5 text-sm text-brand-600 dark:text-brand-400 font-medium">
              Open candidates <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardBody>
        </Card>
        <Card hover>
          <CardBody>
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <KanbanSquare className="h-4 w-4" />
            </div>
            <h3 className="font-semibold">Pipeline</h3>
            <p className="text-sm text-subtle mt-1">Track candidates through your hiring stages and leave HR comments.</p>
            <Link to="/app/pipeline" className="mt-3 inline-flex items-center gap-1.5 text-sm text-brand-600 dark:text-brand-400 font-medium">
              Open pipeline <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
