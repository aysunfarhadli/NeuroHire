import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Briefcase, Building2, ExternalLink, Sparkles, CheckCircle2, FileWarning } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button, Card, Badge, Skeleton, Toast, Textarea } from '@/components/ui';
import { getPublicJob } from '@/api/jobs';
import { getPublicCompany } from '@/api/companies';
import { applyToJob, hasApplied } from '@/api/applications';
import { myCvs } from '@/api/cv';
import { apiErrorMessage } from '@/api/client';
import { useAuth } from '@/store/auth';
import type { Company, JobPost } from '@/types/api';

export default function JobPublicDetail() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState<JobPost | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [hasCv, setHasCv] = useState<boolean | null>(null);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getPublicJob(Number(id))
      .then((j) => {
        setJob(j);
        return getPublicCompany(j.companyId).catch(() => null);
      })
      .then((c) => setCompany(c))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!user || user.role !== 'CANDIDATE' || !id) return;
    hasApplied(Number(id)).then(setAlreadyApplied).catch(() => {});
    myCvs().then((cvs) => setHasCv(cvs.length > 0)).catch(() => setHasCv(false));
  }, [user, id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10">
        <Skeleton className="h-8 w-2/3 mb-3" />
        <Skeleton className="h-4 w-1/3 mb-8" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (notFound || !job) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-semibold">{t('common.notFoundTitle')}</h1>
        <p className="mt-2 text-subtle">{t('common.notFoundBody')}</p>
        <Link to="/jobs" className="inline-block mt-6">
          <Button variant="outline" iconLeft={<ArrowLeft className="h-4 w-4" />}>{t('common.jobs')}</Button>
        </Link>
      </div>
    );
  }

  const startApply = () => {
    setError(null);
    if (!user) {
      navigate(`/register?next=${encodeURIComponent(`/jobs/${job.id}`)}`);
      return;
    }
    if (user.role !== 'CANDIDATE') {
      setError(t('applications.notCandidateBody'));
      return;
    }
    if (hasCv === false) {
      navigate('/app/cv');
      return;
    }
    setShowApplyForm(true);
  };

  const submitApply = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await applyToJob({ jobId: job.id, coverLetter: coverLetter.trim() || undefined, source: 'WEB' });
      setSuccess(true);
      setAlreadyApplied(true);
      setShowApplyForm(false);
    } catch (e) {
      setError(apiErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  const renderCta = () => {
    if (success || alreadyApplied) {
      return (
        <div className="inline-flex items-center gap-2 px-4 h-12 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/30 font-medium text-sm">
          <CheckCircle2 className="h-4 w-4" />
          {t('applications.alreadyApplied')}
        </div>
      );
    }
    if (user && user.role === 'CANDIDATE' && hasCv === false) {
      return (
        <Button size="lg" variant="outline" iconLeft={<FileWarning className="h-4 w-4" />} onClick={() => navigate('/app/cv')}>
          {t('applications.needCvCta')}
        </Button>
      );
    }
    return (
      <Button size="lg" iconLeft={<Sparkles className="h-4 w-4" />} onClick={startApply}>
        {user ? t('applications.apply') : t('jobsPublic.signUpToApply')}
      </Button>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <Link to="/jobs" className="inline-flex items-center gap-1.5 text-sm text-subtle hover:text-fg mb-6">
        <ArrowLeft className="h-4 w-4" /> {t('common.jobs')}
      </Link>

      {success && <Toast kind="success">{t('applications.success')}</Toast>}
      {error && <Toast kind="error">{error}</Toast>}

      <Card className="p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{job.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-subtle">
              {company && (
                <Link to={`/companies/${company.id}`} className="inline-flex items-center gap-1.5 hover:text-fg">
                  <Building2 className="h-4 w-4" /> {company.name}
                </Link>
              )}
              {job.location && (
                <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {job.location}</span>
              )}
              {job.employmentType && (
                <span className="inline-flex items-center gap-1.5"><Briefcase className="h-4 w-4" /> {job.employmentType.replace('_', ' ')}</span>
              )}
              {job.seniority && <Badge tone="violet">{job.seniority}</Badge>}
            </div>
          </div>
          {renderCta()}
        </div>

        {showApplyForm && (
          <div className="mt-6 p-5 rounded-xl border border-border bg-bg/40 space-y-4 animate-fade-in-up">
            <Textarea
              label={t('applications.coverLetter')}
              placeholder={t('applications.coverLetterPlaceholder') ?? ''}
              rows={5}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setShowApplyForm(false)} disabled={submitting}>
                {t('applications.cancel')}
              </Button>
              <Button onClick={submitApply} loading={submitting} iconLeft={<Sparkles className="h-4 w-4" />}>
                {submitting ? t('applications.applying') : t('applications.submit')}
              </Button>
            </div>
          </div>
        )}

        <div className="mt-7">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-subtle mb-3">
            {t('jobsPublic.description')}
          </h2>
          <div className="prose prose-invert max-w-none whitespace-pre-wrap text-fg leading-relaxed text-[15px]">
            {job.description}
          </div>
        </div>
      </Card>

      {company && (
        <Card className="mt-6 p-7">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-subtle mb-3">
            {t('jobsPublic.aboutCompany')}
          </h2>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <Link to={`/companies/${company.id}`} className="text-lg font-semibold hover:text-brand-600 dark:hover:text-brand-300">
                {company.name}
              </Link>
              {company.industry && <div className="text-sm text-subtle mt-0.5">{company.industry}</div>}
              {company.description && <p className="mt-3 text-sm text-fg leading-relaxed">{company.description}</p>}
            </div>
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer noopener"
                className="text-sm text-brand-600 dark:text-brand-300 hover:underline inline-flex items-center gap-1 shrink-0"
              >
                {t('companiesPublic.visitWebsite')} <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
