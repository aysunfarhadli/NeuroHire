import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Brain, Download, Sparkles, Trash2, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge, Button, Card, CardBody, CardHeader, Skeleton, Toast } from '@/components/ui';
import { analyzeJob, deleteJob, getJob, getJobAnalysis } from '@/api/jobs';
import { ranking } from '@/api/match';
import type { JobAnalysis, JobPost, RankingRow } from '@/types/api';
import { apiErrorMessage } from '@/api/client';
import { formatDate } from '@/lib/format';

export default function JobDetail() {
  const { t } = useTranslation();
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
    if (!confirm(t('hrJobs.deleteConfirm'))) return;
    try { await deleteJob(jobId); window.location.href = '/app/jobs'; } catch (e) { setError(apiErrorMessage(e)); }
  }

  function downloadCsv() {
    const tok = localStorage.getItem('hm_access');
    fetch(`/api/reports/jobs/${jobId}/csv`, { headers: { Authorization: `Bearer ${tok}` } })
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
        <ArrowLeft className="h-4 w-4" /> {t('hrJobs.backToJobs')}
      </Link>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-semibold tracking-tight">{job.title}</h1>
            <Badge tone={job.status === 'OPEN' ? 'green' : 'gray'}>{job.status}</Badge>
            {job.seniority && <Badge tone="violet">{job.seniority}</Badge>}
          </div>
          <div className="mt-2 text-sm text-subtle">
            {job.location && <>{job.location} · </>}
            {job.employmentType} · {formatDate(job.createdAt)}
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={runAnalyze} loading={loading} iconLeft={<Sparkles className="h-4 w-4" />}>
            {analysis ? t('hrJobs.reAnalyze') : t('hrJobs.analyzeAi')}
          </Button>
          <Button onClick={downloadCsv} variant="outline" iconLeft={<Download className="h-4 w-4" />}>{t('hrJobs.exportCsv')}</Button>
          <Button onClick={onDelete} variant="ghost" iconLeft={<Trash2 className="h-4 w-4" />}>{t('hrJobs.delete')}</Button>
        </div>
      </div>

      {error && <Toast kind="error">{error}</Toast>}

      {analysis && (
        <Card>
          <CardHeader title={t('hrJobs.aiAnalysisTitle')} subtitle={t('hrJobs.aiAnalysisSub')} />
          <CardBody className="space-y-5">
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <Meta label={t('hrJobs.metaDomain')} value={analysis.domain} />
              <Meta label={t('hrJobs.metaSeniority')} value={analysis.seniority} />
              <Meta label={t('hrJobs.metaMinYears')} value={analysis.minYearsExperience} />
            </div>
            <SkillsBlock title={t('hrJobs.mustHave')} tone="red" items={analysis.mustHaveSkills} />
            <SkillsBlock title={t('hrJobs.niceToHave')} tone="amber" items={analysis.niceToHaveSkills} />
            <div>
              <div className="text-xs uppercase tracking-wider text-subtle mb-2">{t('hrJobs.responsibilities')}</div>
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
          title={t('hrJobs.rankingTitle')}
          subtitle={t('hrJobs.rankingSub', { count: rows.length })}
          action={<Link to={`/app/candidates`}><Button size="sm" variant="outline" iconLeft={<Users className="h-4 w-4" />}>{t('hrJobs.addCandidates')}</Button></Link>}
        />
        <CardBody className="p-0">
          {rows.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-subtle">
              {t('hrJobs.rankingEmpty', { candidates: '' })}
              <Link to="/app/candidates" className="text-brand-600 dark:text-brand-400 font-medium">{t('common.candidates')}</Link>.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-subtle border-b border-border">
                  <th className="px-5 py-3">{t('hrJobs.colNum')}</th>
                  <th className="px-5 py-3">{t('hrJobs.colCandidate')}</th>
                  <th className="px-5 py-3">{t('hrJobs.colCv')}</th>
                  <th className="px-5 py-3">{t('hrJobs.colScore')}</th>
                  <th className="px-5 py-3">{t('hrJobs.colRecommendation')}</th>
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
        <CardHeader title={t('hrJobs.descriptionTitle')} />
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
