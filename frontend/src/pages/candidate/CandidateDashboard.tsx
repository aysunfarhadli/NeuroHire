import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Sparkles, Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge, Button, Card, CardBody, CardHeader, EmptyState, Skeleton, StatTile } from '@/components/ui';
import { myCvs } from '@/api/cv';
import { listPublicOpen } from '@/api/jobs';
import type { CvSummary, JobPost } from '@/types/api';
import { relativeTime, formatBytes } from '@/lib/format';

export default function CandidateDashboard() {
  const { t } = useTranslation();
  const [cvs, setCvs] = useState<CvSummary[] | null>(null);
  const [jobs, setJobs] = useState<JobPost[] | null>(null);

  useEffect(() => {
    myCvs().then(setCvs).catch(() => setCvs([]));
    listPublicOpen().then(setJobs).catch(() => setJobs([]));
  }, []);

  const lastCv = cvs?.[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t('dashboard.candidateTitle')}</h1>
        <p className="text-sm text-subtle mt-1">{t('dashboard.candidateSub')}</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <StatTile label={t('dashboard.myCvs')} value={cvs?.length ?? '—'} accent="brand" />
        <StatTile label={t('dashboard.openJobs')} value={jobs?.length ?? '—'} accent="green" />
        <StatTile
          label={t('dashboard.lastUpload')}
          value={lastCv ? relativeTime(lastCv.createdAt) : '—'}
          hint={lastCv?.fileName}
          accent="amber"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader
            title={t('dashboard.myCvs')}
            subtitle={t('dashboard.recentUploads')}
            action={
              <Link to="/app/cv">
                <Button size="sm" iconLeft={<Upload className="h-4 w-4" />}>{t('dashboard.uploadCv')}</Button>
              </Link>
            }
          />
          <CardBody className="p-0">
            {cvs === null ? (
              <div className="p-5 space-y-3">
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
              </div>
            ) : cvs.length === 0 ? (
              <EmptyState
                icon={<FileText className="h-6 w-6" />}
                title={t('cv.noCvsTitle')}
                description={t('cv.noCvsBody')}
                action={<Link to="/app/cv"><Button iconLeft={<Upload className="h-4 w-4" />}>{t('dashboard.uploadCv')}</Button></Link>}
              />
            ) : (
              <ul className="divide-y divide-border">
                {cvs.slice(0, 5).map((cv) => (
                  <li key={cv.id}>
                    <Link to={`/app/cv/${cv.id}`} className="flex items-center justify-between px-5 py-3.5 hover:bg-fg/[0.03]">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-9 w-9 rounded-lg bg-fg/[0.06] flex items-center justify-center shrink-0">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">{cv.fileName}</div>
                          <div className="text-xs text-subtle">
                            {formatBytes(cv.fileSize)} · {relativeTime(cv.createdAt)}
                          </div>
                        </div>
                      </div>
                      <ParsingBadge status={cv.parsingStatus} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title={t('dashboard.openPositions')} subtitle={t('dashboard.applyToRoles')} />
          <CardBody className="p-0">
            {jobs === null ? (
              <div className="p-5 space-y-3">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
              </div>
            ) : jobs.length === 0 ? (
              <EmptyState icon={<Sparkles className="h-6 w-6" />} title={t('dashboard.noOpenJobs')} description={t('dashboard.checkBack')} />
            ) : (
              <ul className="divide-y divide-border">
                {jobs.slice(0, 5).map((j) => (
                  <li key={j.id}>
                    <Link to={`/app/jobs/${j.id}`} className="block px-5 py-3.5 hover:bg-fg/[0.03]">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium truncate">{j.title}</div>
                        <ArrowRight className="h-4 w-4 text-subtle" />
                      </div>
                      <div className="mt-1 text-xs text-subtle flex gap-2 flex-wrap">
                        {j.seniority && <Badge tone="violet">{j.seniority}</Badge>}
                        {j.location && <span>{j.location}</span>}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function ParsingBadge({ status }: { status: CvSummary['parsingStatus'] }) {
  const { t } = useTranslation();
  switch (status) {
    case 'DONE': return <Badge tone="green">{t('cv.parsed')}</Badge>;
    case 'PROCESSING': return <Badge tone="blue">{t('cv.processing')}</Badge>;
    case 'PENDING': return <Badge tone="amber">{t('cv.pending')}</Badge>;
    case 'FAILED': return <Badge tone="red">{t('cv.failed')}</Badge>;
  }
}
