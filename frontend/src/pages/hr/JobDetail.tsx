import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Brain, Download, Sparkles, Trash2, Users } from 'lucide-react';
import { Badge, Button, Card, CardBody, CardHeader, Skeleton, Toast } from '@/components/ui';
import { analyzeJob, deleteJob, getJob, getJobAnalysis } from '@/api/jobs';
import { ranking } from '@/api/match';
import type { JobAnalysis, JobPost, RankingRow } from '@/types/api';
import { apiErrorMessage } from '@/api/client';
import { formatDate } from '@/lib/format';

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const jobId = Number(id);
  const [job, setJob] = useState<JobPost | null>(null);
  const [analysis, setAnalysis] = useState<JobAnalysis | null>(null);
  const [rows, setRows] = useState<RankingRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getJob(jobId).then(setJob).catch((e) => setError(apiErrorMessage(e)));
    getJobAnalysis(jobId).then(setAnalysis).catch(() => setAnalysis(null));
    ranking(jobId).then(setRows).catch(() => setRows([]));
  }, [jobId]);

  async function runAnalyze() {
    setLoading(true); setError(null);
    try { setAnalysis(await analyzeJob(jobId)); } catch (e) { setError(apiErrorMessage(e)); } finally { setLoading(false); }
  }

  async function onDelete() {
    if (!confirm('Delete this job? This cannot be undone.')) return;
    try { await deleteJob(jobId); window.location.href = '/app/jobs'; } catch (e) { setError(apiErrorMessage(e)); }
  }

  function downloadCsv() {
    const t = localStorage.getItem('hm_access');
    fetch(`/api/reports/jobs/${jobId}/csv`, { headers: { Authorization: `Bearer ${t}` } })
      .then((r) => r.blob())
      .then((b) => {
        const url = URL.createObjectURL(b);
        const a = document.createElement('a');
        a.href = url; a.download = `job-${jobId}-ranking.csv`; a.click();
        URL.revokeObjectURL(url);
      });
  }

  if (!job) return <Skeleton className="h-64" />;

  return (
    <div className="space-y-6">
      <Link to="/app/jobs" className="inline-flex items-center gap-2 text-sm text-subtle hover:text-fg">
        <ArrowLeft className="h-4 w-4" /> Back to jobs
      </Link>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-semibold">{job.title}</h1>
            <Badge tone={job.status === 'OPEN' ? 'green' : 'gray'}>{job.status}</Badge>
            {job.seniority && <Badge tone="violet">{job.seniority}</Badge>}
          </div>
          <div className="mt-2 text-sm text-subtle">
            {job.location && <>{job.location} · </>}
            {job.employmentType} · created {formatDate(job.createdAt)}
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={runAnalyze} loading={loading} iconLeft={<Sparkles className="h-4 w-4" />}>
            {analysis ? 'Re-analyze' : 'Analyze with AI'}
          </Button>
          <Button onClick={downloadCsv} variant="outline" iconLeft={<Download className="h-4 w-4" />}>Export CSV</Button>
          <Button onClick={onDelete} variant="ghost" iconLeft={<Trash2 className="h-4 w-4" />}>Delete</Button>
        </div>
      </div>

      {error && <Toast kind="error">{error}</Toast>}

      {analysis && (
        <Card>
          <CardHeader title="AI job analysis" subtitle="Extracted by HireMind AI" />
          <CardBody className="space-y-5">
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <Meta label="Domain" value={analysis.domain} />
              <Meta label="Seniority" value={analysis.seniority} />
              <Meta label="Min years" value={analysis.minYearsExperience} />
            </div>
            <SkillsBlock title="Must-have skills" tone="red" items={analysis.mustHaveSkills} />
            <SkillsBlock title="Nice-to-have skills" tone="amber" items={analysis.niceToHaveSkills} />
            <div>
              <div className="text-xs uppercase tracking-wider text-subtle mb-2">Responsibilities</div>
              <ul className="space-y-1 text-sm">
                {analysis.responsibilities.map((r, i) => (
                  <li key={i} className="flex gap-2"><span className="text-brand-500">•</span>{r}</li>
                ))}
              </ul>
            </div>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader
          title="Candidate ranking"
          subtitle={`${rows.length} candidate${rows.length === 1 ? '' : 's'} matched, sorted by total score`}
          action={<Link to={`/app/candidates`}><Button size="sm" variant="outline" iconLeft={<Users className="h-4 w-4" />}>Add candidates</Button></Link>}
        />
        <CardBody className="p-0">
          {rows.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-subtle">
              No matches yet. Go to <Link to="/app/candidates" className="text-brand-600 dark:text-brand-400 font-medium">Candidates</Link> to match CVs against this job.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-subtle border-b border-border">
                  <th className="px-5 py-3">#</th>
                  <th className="px-5 py-3">Candidate</th>
                  <th className="px-5 py-3">CV</th>
                  <th className="px-5 py-3">Score</th>
                  <th className="px-5 py-3">Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.matchId} className="border-b border-border last:border-0">
                    <td className="px-5 py-3 text-subtle">{i + 1}</td>
                    <td className="px-5 py-3">User #{r.candidateUserId}</td>
                    <td className="px-5 py-3"><Link to={`/app/cv/${r.cvId}`} className="text-brand-600 dark:text-brand-400">CV #{r.cvId}</Link></td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 bg-fg/[0.07] rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-brand-500 to-violet-500" style={{ width: `${r.totalScore}%` }} />
                        </div>
                        <span className="font-semibold">{r.totalScore}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <Badge tone={r.recommendation === 'STRONG_MATCH' ? 'green' : r.recommendation === 'POTENTIAL_MATCH' ? 'amber' : 'red'}>
                        {r.recommendation.replace('_', ' ')}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Description" />
        <CardBody><pre className="whitespace-pre-wrap text-sm text-fg/90 font-sans leading-relaxed">{job.description}</pre></CardBody>
      </Card>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string | number | null }) {
  return (
    <div className="rounded-lg bg-fg/[0.04] px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-subtle">{label}</div>
      <div className="text-sm font-medium mt-0.5 flex items-center gap-2">
        <Brain className="h-3.5 w-3.5 text-brand-500" />
        {value ?? '—'}
      </div>
    </div>
  );
}

function SkillsBlock({ title, items, tone }: { title: string; items: string[]; tone: 'red' | 'amber' }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-subtle mb-2">{title}</div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((s) => <Badge key={s} tone={tone}>{s}</Badge>)}
      </div>
    </div>
  );
}
