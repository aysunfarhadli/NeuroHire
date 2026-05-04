import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, FileText, RefreshCw, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge, Button, Card, CardBody, CardHeader, ScoreRing, Skeleton, Toast } from '@/components/ui';
import { getCv } from '@/api/cv';
import { analyzeCv, latestCvAnalysis } from '@/api/ai';
import { listJobs } from '@/api/jobs';
import type { CvAnalysisAi, CvDetail, JobPost, Recommendation } from '@/types/api';
import { apiErrorMessage } from '@/api/client';
import { formatBytes, formatDate } from '@/lib/format';

const RECOMMENDATION_TONE: Record<Recommendation, 'green' | 'amber' | 'red'> = {
  STRONG_MATCH: 'green',
  POTENTIAL_MATCH: 'amber',
  WEAK_MATCH: 'red',
};

export default function CvDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const cvId = Number(id);
  const [cv, setCv] = useState<CvDetail | null>(null);
  const [analysis, setAnalysis] = useState<CvAnalysisAi | null>(null);
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [selectedJob, setSelectedJob] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCv(cvId).then(setCv).catch((e) => setError(apiErrorMessage(e)));
    listJobs().then(setJobs).catch(() => {});
    latestCvAnalysis(cvId).then(setAnalysis).catch(() => setAnalysis(null));
  }, [cvId]);

  async function runAnalysis() {
    setLoading(true);
    setError(null);
    try {
      const a = await analyzeCv(cvId, selectedJob === '' ? undefined : Number(selectedJob));
      setAnalysis(a);
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  if (!cv) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/app/cv" className="inline-flex items-center gap-2 text-sm text-subtle hover:text-fg">
        <ArrowLeft className="h-4 w-4" /> {t('cvAnalysis.backToCvs')}
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-fg/[0.06] flex items-center justify-center">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold truncate">{cv.fileName}</h1>
            <div className="text-sm text-subtle">
              {formatBytes(cv.fileSize)} · {cv.contentType} · {formatDate(cv.createdAt)}
            </div>
          </div>
        </div>
        <div className="flex items-end gap-2">
          <select
            className="h-10 px-3 rounded-lg bg-surface border border-border text-fg text-sm"
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value === '' ? '' : Number(e.target.value))}
          >
            <option value="">{t('cvAnalysis.matchAgainst')}</option>
            {jobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
          </select>
          <Button onClick={runAnalysis} loading={loading} iconLeft={<Sparkles className="h-4 w-4" />}>
            {analysis ? t('cvAnalysis.reAnalyze') : t('cvAnalysis.analyzeAi')}
          </Button>
        </div>
      </div>

      {error && <Toast kind="error">{error}</Toast>}
      {cv.parsingStatus !== 'DONE' && (
        <Toast kind="info">
          {t('cvAnalysis.parsingStatus', { status: cv.parsingStatus })} {cv.parsingError && <span>· {cv.parsingError}</span>}
        </Toast>
      )}

      {analysis ? (
        <AnalysisView a={analysis} />
      ) : (
        <Card>
          <CardBody className="text-center py-14">
            <div className="mx-auto h-12 w-12 rounded-full bg-fg/[0.05] flex items-center justify-center mb-3 text-subtle">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="font-semibold">{t('cvAnalysis.noAnalysisTitle')}</h3>
            <p className="text-sm text-subtle mt-1 max-w-md mx-auto">
              {t('cvAnalysis.noAnalysisBody', { analyze: t('cvAnalysis.analyzeAi') })}
            </p>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader title={t('cvAnalysis.extractedTitle')} subtitle={t('cvAnalysis.extractedSub')} />
        <CardBody>
          <pre className="whitespace-pre-wrap text-xs text-fg/80 font-mono leading-relaxed max-h-80 overflow-y-auto">
            {cv.extractedText || t('cvAnalysis.inProgress')}
          </pre>
        </CardBody>
      </Card>
    </div>
  );
}

function AnalysisView({ a }: { a: CvAnalysisAi }) {
  const { t } = useTranslation();
  const breakdown = [
    { label: 'Skills', value: a.scoreBreakdown.skills },
    { label: 'Experience', value: a.scoreBreakdown.experience },
    { label: 'Education', value: a.scoreBreakdown.education },
    { label: 'Domain', value: a.scoreBreakdown.domain },
    { label: 'ATS', value: a.scoreBreakdown.atsFormat },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardBody className="grid md:grid-cols-3 gap-6 items-center">
          <div className="flex flex-col items-center justify-center">
            <div className="relative">
              <ScoreRing value={a.matchScore} label={t('cvAnalysis.matchLabel')} size={140} />
            </div>
            <Badge tone={RECOMMENDATION_TONE[a.recommendation]}>
              {a.recommendation.replace('_', ' ')}
            </Badge>
            <div className="mt-1 text-xs text-subtle">{t('cvAnalysis.aiConfidence', { pct: (a.aiConfidence * 100).toFixed(0) })}</div>
          </div>
          <div className="md:col-span-2">
            <div className="text-xs uppercase tracking-wider text-subtle mb-1">{t('cvAnalysis.candidateLevel')}</div>
            <div className="text-lg font-semibold">{a.candidateLevel}</div>
            <p className="mt-3 text-sm text-fg/90 leading-relaxed">{a.professionalSummary}</p>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {breakdown.map((b) => (
                <div key={b.label} className="rounded-lg bg-fg/[0.04] p-2 text-center">
                  <div className="text-[10px] uppercase tracking-wider text-subtle">{b.label}</div>
                  <div className="text-lg font-semibold mt-0.5">{b.value}</div>
                </div>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader title={t('cvAnalysis.strengths')} />
          <CardBody className="space-y-2">
            {a.strengths.length === 0 && <span className="text-sm text-subtle">—</span>}
            {a.strengths.map((s, i) => (
              <div key={i} className="text-sm flex gap-2"><span className="text-emerald-500">✓</span>{s}</div>
            ))}
          </CardBody>
        </Card>
        <Card>
          <CardHeader title={t('cvAnalysis.weaknesses')} />
          <CardBody className="space-y-2">
            {a.weaknesses.length === 0 && <span className="text-sm text-subtle">—</span>}
            {a.weaknesses.map((s, i) => (
              <div key={i} className="text-sm flex gap-2"><span className="text-amber-500">!</span>{s}</div>
            ))}
          </CardBody>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader title={t('cvAnalysis.technicalSkills')} />
          <CardBody className="flex flex-wrap gap-2">
            {a.technicalSkills.map((s) => <Badge key={s} tone="violet">{s}</Badge>)}
            {a.technicalSkills.length === 0 && <span className="text-sm text-subtle">{t('cvAnalysis.technicalEmpty')}</span>}
          </CardBody>
        </Card>
        <Card>
          <CardHeader title={t('cvAnalysis.missingKeywords')} subtitle={t('cvAnalysis.missingSub')} />
          <CardBody className="flex flex-wrap gap-2">
            {a.missingKeywords.map((s) => <Badge key={s} tone="red">{s}</Badge>)}
            {a.missingKeywords.length === 0 && <span className="text-sm text-subtle">{t('cvAnalysis.missingEmpty')}</span>}
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title={t('cvAnalysis.hrExplanation')} subtitle={t('cvAnalysis.hrExplanationSub')} />
        <CardBody><p className="text-sm leading-relaxed text-fg/90">{a.hrExplanation}</p></CardBody>
      </Card>

      <Card>
        <CardHeader title={t('cvAnalysis.feedbackTitle')} subtitle={t('cvAnalysis.feedbackSub')} />
        <CardBody><p className="text-sm leading-relaxed text-fg/90">{a.candidateFeedback}</p></CardBody>
      </Card>

      <Card>
        <CardHeader title={t('cvAnalysis.rewritesTitle')} subtitle={t('cvAnalysis.rewritesSub')} />
        <CardBody className="space-y-4">
          {a.cvRewrites.map((r, i) => (
            <div key={i} className="grid md:grid-cols-2 gap-4">
              <div className="rounded-lg border border-border p-3">
                <div className="text-[10px] uppercase tracking-wider text-subtle mb-1">{t('cvAnalysis.before')}</div>
                <div className="text-sm">{r.before}</div>
              </div>
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
                <div className="text-[10px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">{t('cvAnalysis.after')}</div>
                <div className="text-sm">{r.after}</div>
                <div className="text-xs text-subtle mt-2"><RefreshCw className="inline h-3 w-3 mr-1" />{r.reason}</div>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>

      <Card>
        <CardHeader title={t('cvAnalysis.interviewTitle')} subtitle={t('cvAnalysis.interviewSub')} />
        <CardBody className="space-y-3">
          {a.interviewQuestions.map((q, i) => (
            <div key={i} className="rounded-lg border border-border p-3">
              <div className="text-sm font-medium">{q.question}</div>
              <div className="text-xs text-subtle mt-1">{t('cvAnalysis.interviewWhy', { reason: q.reason })}</div>
            </div>
          ))}
        </CardBody>
      </Card>

      {a.riskFlags.length > 0 && (
        <Card>
          <CardHeader title={t('cvAnalysis.riskTitle')} subtitle={t('cvAnalysis.riskSub')} />
          <CardBody className="space-y-2">
            {a.riskFlags.map((f, i) => (
              <div key={i} className="flex gap-2 text-sm"><AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />{f}</div>
            ))}
          </CardBody>
        </Card>
      )}
    </div>
  );
}
