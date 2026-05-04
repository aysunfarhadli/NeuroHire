import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Trash2, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge, Card, CardBody, CardHeader, EmptyState, Skeleton, Toast } from '@/components/ui';
import CvDropZone from '@/components/CvDropZone';
import { deleteCv, myCvs, uploadCv } from '@/api/cv';
import type { CvSummary } from '@/types/api';
import { formatBytes, relativeTime } from '@/lib/format';
import { apiErrorMessage } from '@/api/client';

export default function CvList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [cvs, setCvs] = useState<CvSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try { setCvs(await myCvs()); } catch (e) { setError(apiErrorMessage(e)); }
  }

  useEffect(() => { load(); }, []);

  async function onFile(file: File, onProgress: (p: number) => void) {
    setError(null);
    try {
      const created = await uploadCv(file, onProgress);
      // refresh list once + poll twice for async parsing completion
      await load();
      setTimeout(load, 1500);
      setTimeout(load, 4000);
      // navigate to new CV detail so analysis can run
      setTimeout(() => navigate(`/app/cv/${created.id}`), 1200);
    } catch (err) {
      setError(apiErrorMessage(err));
      throw err;
    }
  }

  async function onDelete(id: number) {
    if (!confirm(t('cv.deleteConfirm'))) return;
    try { await deleteCv(id); await load(); } catch (e) { setError(apiErrorMessage(e)); }
  }

  function statusTone(s: CvSummary['parsingStatus']) {
    switch (s) {
      case 'DONE': return 'green' as const;
      case 'PROCESSING': return 'blue' as const;
      case 'PENDING': return 'amber' as const;
      case 'FAILED': return 'red' as const;
    }
  }
  function statusLabel(s: CvSummary['parsingStatus']) {
    switch (s) {
      case 'DONE': return t('cv.parsed');
      case 'PROCESSING': return t('cv.processing');
      case 'PENDING': return t('cv.pending');
      case 'FAILED': return t('cv.failed');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t('cv.pageTitle')}</h1>
        <p className="text-sm text-subtle mt-1">{t('cv.pageSub')}</p>
      </div>

      {error && <Toast kind="error">{error}</Toast>}

      <CvDropZone onFile={onFile} />

      <Card>
        <CardHeader title={t('cv.allCvs')} subtitle={t('cv.mostRecent')} />
        <CardBody className="p-0">
          {cvs === null ? (
            <div className="p-5 space-y-3">
              <Skeleton className="h-12" /><Skeleton className="h-12" /><Skeleton className="h-12" />
            </div>
          ) : cvs.length === 0 ? (
            <EmptyState
              icon={<FileText className="h-6 w-6" />}
              title={t('cv.noCvsTitle')}
              description={t('cv.noCvsBody')}
            />
          ) : (
            <ul className="divide-y divide-border">
              {cvs.map((cv) => (
                <li key={cv.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-fg/[0.02] transition-colors">
                  <Link to={`/app/cv/${cv.id}`} className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="h-10 w-10 rounded-lg bg-fg/[0.06] flex items-center justify-center shrink-0">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{cv.fileName}</div>
                      <div className="text-xs text-subtle">{formatBytes(cv.fileSize)} · {relativeTime(cv.createdAt)}</div>
                      {cv.parsingError && <div className="text-xs text-red-500 mt-0.5">{cv.parsingError}</div>}
                    </div>
                  </Link>
                  <div className="flex items-center gap-3">
                    {cv.parsingStatus === 'DONE' && (
                      <Link to={`/app/cv/${cv.id}`} className="inline-flex items-center gap-1 text-xs text-brand-600 dark:text-brand-300 hover:underline">
                        <Sparkles className="h-3 w-3" /> {t('cv.analysisReady')}
                      </Link>
                    )}
                    <Badge tone={statusTone(cv.parsingStatus)}>{statusLabel(cv.parsingStatus)}</Badge>
                    <button
                      onClick={() => onDelete(cv.id)}
                      className="h-8 w-8 rounded-md hover:bg-red-500/10 text-subtle hover:text-red-500 flex items-center justify-center"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
