import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Sparkles } from 'lucide-react';
import { Badge, Button, Card, CardBody, CardHeader, EmptyState, Skeleton, Toast } from '@/components/ui';
import { listJobs } from '@/api/jobs';
import { match } from '@/api/match';
import { apiErrorMessage } from '@/api/client';
import type { JobPost, MatchResult } from '@/types/api';

export default function Candidates() {
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [cvIdInput, setCvIdInput] = useState('');
  const [selectedJob, setSelectedJob] = useState<number | ''>('');
  const [result, setResult] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { listJobs().then(setJobs).catch(() => {}); }, []);

  async function run() {
    setLoading(true); setError(null); setResult(null);
    try {
      const cvId = Number(cvIdInput);
      if (!cvId || !selectedJob) throw new Error('Provide both a CV id and a job.');
      setResult(await match(cvId, Number(selectedJob)));
    } catch (e) { setError(apiErrorMessage(e)); } finally { setLoading(false); }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Candidates</h1>
        <p className="text-sm text-subtle mt-1">Match any CV against any job to compute a score.</p>
      </div>

      <Card>
        <CardHeader title="Run a match" subtitle="Enter a CV id and pick a job" />
        <CardBody className="grid md:grid-cols-3 gap-3 items-end">
          <label className="block">
            <span className="block mb-1.5 text-sm font-medium">CV id</span>
            <input
              value={cvIdInput} onChange={(e) => setCvIdInput(e.target.value)} type="number" min={1}
              className="block w-full h-10 px-3 rounded-lg bg-surface border border-border text-fg placeholder:text-subtle/60 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              placeholder="e.g. 1"
            />
          </label>
          <label className="block">
            <span className="block mb-1.5 text-sm font-medium">Job</span>
            <select
              className="block w-full h-10 px-3 rounded-lg bg-surface border border-border text-fg"
              value={selectedJob} onChange={(e) => setSelectedJob(e.target.value === '' ? '' : Number(e.target.value))}
            >
              <option value="">Select a job...</option>
              {jobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
            </select>
          </label>
          <Button onClick={run} loading={loading} iconLeft={<Sparkles className="h-4 w-4" />}>Run match</Button>
        </CardBody>
      </Card>

      {error && <Toast kind="error">{error}</Toast>}

      {result ? (
        <Card>
          <CardHeader title={`Match #${result.id}`} subtitle={`CV ${result.cvId} ↔ Job ${result.jobId}`} />
          <CardBody>
            <div className="grid sm:grid-cols-3 md:grid-cols-6 gap-3 text-sm">
              <Tile label="Total" value={result.totalScore} highlight />
              <Tile label="Skills" value={result.skillScore} />
              <Tile label="Experience" value={result.experienceScore} />
              <Tile label="Education" value={result.educationScore} />
              <Tile label="Domain" value={result.domainScore} />
              <Tile label="ATS" value={result.atsScore} />
            </div>
            <div className="mt-4">
              <Badge tone={result.recommendation === 'STRONG_MATCH' ? 'green' : result.recommendation === 'POTENTIAL_MATCH' ? 'amber' : 'red'}>
                {result.recommendation.replace('_', ' ')}
              </Badge>
            </div>
            <Link to={`/app/cv/${result.cvId}`} className="mt-4 inline-flex items-center gap-1.5 text-sm text-brand-600 dark:text-brand-400">
              <FileText className="h-4 w-4" /> View full AI analysis
            </Link>
          </CardBody>
        </Card>
      ) : (
        <Card><CardBody>
          <EmptyState
            icon={<Sparkles className="h-6 w-6" />}
            title="No match run yet"
            description="The candidate flow ends with an explainable score breakdown — try the demo CV first."
          />
        </CardBody></Card>
      )}
    </div>
  );
}

function Tile({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className={`rounded-lg p-3 ${highlight ? 'bg-brand-500/10 border border-brand-500/30' : 'bg-fg/[0.04]'}`}>
      <div className="text-[10px] uppercase tracking-wider text-subtle">{label}</div>
      <div className={`mt-0.5 text-xl font-semibold ${highlight ? 'text-brand-600 dark:text-brand-400' : ''}`}>{value}</div>
    </div>
  );
}
