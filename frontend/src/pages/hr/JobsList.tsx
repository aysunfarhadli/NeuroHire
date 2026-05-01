import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Plus, Search } from 'lucide-react';
import { Badge, Button, Card, CardBody, EmptyState, Input, Skeleton } from '@/components/ui';
import { listJobs } from '@/api/jobs';
import type { JobPost } from '@/types/api';
import { relativeTime } from '@/lib/format';

export default function JobsList() {
  const [jobs, setJobs] = useState<JobPost[] | null>(null);
  const [q, setQ] = useState('');

  useEffect(() => { listJobs().then(setJobs).catch(() => setJobs([])); }, []);

  const filtered = (jobs || []).filter((j) =>
    !q || j.title.toLowerCase().includes(q.toLowerCase()) || (j.location || '').toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Jobs</h1>
          <p className="text-sm text-subtle mt-1">All your job postings.</p>
        </div>
        <Link to="/app/jobs/new"><Button iconLeft={<Plus className="h-4 w-4" />}>New job</Button></Link>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-subtle" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search title or location..." className="pl-9" />
      </div>

      {jobs === null ? (
        <div className="grid md:grid-cols-2 gap-4">
          <Skeleton className="h-28" /><Skeleton className="h-28" />
        </div>
      ) : filtered.length === 0 ? (
        <Card><CardBody>
          <EmptyState icon={<Briefcase className="h-6 w-6" />} title={q ? 'No jobs match your search' : 'No jobs yet'}
            description={q ? 'Try a different keyword.' : 'Create your first job posting to start screening candidates.'}
            action={!q && <Link to="/app/jobs/new"><Button iconLeft={<Plus className="h-4 w-4" />}>Create job</Button></Link>}
          />
        </CardBody></Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((j) => (
            <Link key={j.id} to={`/app/jobs/${j.id}`}>
              <Card hover className="h-full">
                <CardBody>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold">{j.title}</h3>
                    <Badge tone={j.status === 'OPEN' ? 'green' : 'gray'}>{j.status}</Badge>
                  </div>
                  <div className="mt-2 text-xs text-subtle flex flex-wrap gap-2 items-center">
                    {j.seniority && <Badge tone="violet">{j.seniority}</Badge>}
                    {j.location && <span>{j.location}</span>}
                    {j.employmentType && <span>· {j.employmentType}</span>}
                  </div>
                  <p className="mt-3 text-sm text-fg/80 line-clamp-2">{j.description}</p>
                  <div className="mt-3 text-xs text-subtle">Updated {relativeTime(j.updatedAt)}</div>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
