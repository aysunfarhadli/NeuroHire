import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge, Button, Card, CardBody, CardHeader, EmptyState, Toast } from '@/components/ui';
import { listJobs } from '@/api/jobs';
import { match } from '@/api/match';
import { apiErrorMessage } from '@/api/client';
import type { JobPost, MatchResult } from '@/types/api';

export default function Candidates() {
  const { t } = useTranslation();
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
      if (!cvId || !selectedJob) throw new Error(t('hrCandidates.bothRequired'));
      setResult(await match(cvId, Number(selectedJob)));
    } catch (e) { setError(apiErrorMessage(e)); } finally { setLoading(false); }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t('hrCandidates.title')}</h1>
        <p className="text-sm text-subtle mt-1">{t('hrCandidates.sub')}</p>
      </div>

      <Card>
        <CardHeader title={t('hrCandidates.runMatch')} subtitle={t('hrCandidates.runMatchSub')} />
        <CardBody className="grid md:grid-cols-3 gap-3 items-end">
          <label className="block">
            <span className="block mb-1.5 text-sm font-medium">{t('hrCandidates.cvId')}</span>
            <input
              value={cvIdInput} onChange={(e) => setCvIdInput(e.target.value)} type="number" min={1}
              className="block w-full h-10 px-3 rounded-lg bg-surface border border-border text-fg placeholder:text-subtle/60 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              placeholder={t('hrCandidates.cvIdPh') ?? ''}
            />
          </label>
          <label className="block">
            <span className="block mb-1.5 text-sm font-medium">{t('hrCandidates.job')}</span>
            <select
              className="block w-full h-10 px-3 rounded-lg bg-surface border border-border text-fg"
              value={selectedJob} onChange={(e) => setSelectedJob(e.target.value === '' ? '' : Number(e.target.value))}
            >
              <option value="">{t('hrCandidates.selectJob')}</option>
              {jobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
            </select>
          </label>
          <Button onClick={run} loading={loading} iconLeft={<Sparkles className="h-4 w-4" />}>
            {t('hrCandidates.runMatchBtn')}
          </Button>
        </CardBody>
      </Card>

      {error && <Toast kind="error">{error}</Toast>}

      {result ? (
        <Card>
          <CardHeader
            title={t('hrCandidates.matchTitle', { id: result.id })}
            subtitle={t('hrCandidates.matchSub', { cv: result.cvId, job: result.jobId })}
          />
          <CardBody>
            <div className="grid sm:grid-cols-3 md:grid-cols-6 gap-3 text-sm">
              <Tile label={t('hrCandidates.total')} value={result.totalScore} highlight />
              <Tile label={t('hrCandidates.skills')} value={result.skillScore} />
              <Tile label={t('hrCandidates.experience')} value={result.experienceScore} />
              <Tile label={t('hrCandidates.education')} value={result.educationScore} />
              <Tile label={t('hrCandidates.domain')} value={result.domainScore} />
              <Tile label={t('hrCandidates.ats')} value={result.atsScore} />
            </div>
            <div className="mt-4">
              <Badge tone={result.recommendation === 'STRONG_MATCH' ? 'green' : result.recommendation === 'POTENTIAL_MATCH' ? 'amber' : 'red'}>
                {result.recommendation.replace('_', ' ')}
              </Badge>
            </div>
            <Link to={`/app/cv/${result.cvId}`} className="mt-4 inline-flex items-center gap-1.5 text-sm text-brand-600 dark:text-brand-400">
              <FileText className="h-4 w-4" /> {t('hrCandidates.viewFullAnalysis')}
            </Link>
          </CardBody>
        </Card>
      ) : (
        <Card><CardBody>
          <EmptyState
            icon={<Sparkles className="h-6 w-6" />}
            title={t('hrCandidates.noMatchTitle')}
            description={t('hrCandidates.noMatchBody')}
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
