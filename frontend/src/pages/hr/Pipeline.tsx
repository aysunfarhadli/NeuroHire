import { useEffect, useState } from 'react';
import { Card, CardBody, EmptyState, Skeleton, Toast } from '@/components/ui';
import { KanbanSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { listJobs } from '@/api/jobs';
import { listForJob, setStage } from '@/api/pipeline';
import type { JobPost, PipelineEntry, PipelineStage } from '@/types/api';
import { apiErrorMessage } from '@/api/client';

const STAGES: PipelineStage[] = ['NEW', 'REVIEWED', 'SHORTLISTED', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED'];
const STAGE_TONES: Record<PipelineStage, string> = {
  NEW: 'border-blue-500/40',
  REVIEWED: 'border-cyan-500/40',
  SHORTLISTED: 'border-violet-500/40',
  INTERVIEW: 'border-brand-500/40',
  OFFER: 'border-amber-500/40',
  HIRED: 'border-emerald-500/40',
  REJECTED: 'border-red-500/40',
};

export default function Pipeline() {
  const { t } = useTranslation();
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [selectedJob, setSelectedJob] = useState<number | null>(null);
  const [entries, setEntries] = useState<PipelineEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listJobs().then((js) => {
      setJobs(js);
      if (js.length && selectedJob === null) setSelectedJob(js[0].id);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedJob) return;
    setEntries(null);
    listForJob(selectedJob).then(setEntries).catch((e) => { setError(apiErrorMessage(e)); setEntries([]); });
  }, [selectedJob]);

  function onDragStart(e: React.DragEvent, entryId: number) {
    e.dataTransfer.setData('text/plain', String(entryId));
  }

  async function onDrop(e: React.DragEvent, stage: PipelineStage) {
    e.preventDefault();
    const id = Number(e.dataTransfer.getData('text/plain'));
    const entry = entries?.find((x) => x.id === id);
    if (!entry || entry.stage === stage || !selectedJob) return;
    try {
      await setStage({ jobId: selectedJob, candidateUserId: entry.candidateUserId, stage });
      setEntries(await listForJob(selectedJob));
    } catch (err) { setError(apiErrorMessage(err)); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t('hrPipeline.title')}</h1>
          <p className="text-sm text-subtle mt-1">{t('hrPipeline.sub')}</p>
        </div>
        <select
          className="h-10 px-3 rounded-lg bg-surface border border-border text-fg text-sm"
          value={selectedJob ?? ''}
          onChange={(e) => setSelectedJob(Number(e.target.value))}
        >
          <option value="">{t('hrPipeline.selectJob')}</option>
          {jobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
        </select>
      </div>

      {error && <Toast kind="error">{error}</Toast>}

      {!selectedJob ? (
        <Card><CardBody>
          <EmptyState icon={<KanbanSquare className="h-6 w-6" />} title={t('hrPipeline.pickJob')} description={t('hrPipeline.pickJobSub')} />
        </CardBody></Card>
      ) : entries === null ? (
        <div className="grid grid-cols-2 lg:grid-cols-7 gap-3">
          {STAGES.map((s) => <Skeleton key={s} className="h-40" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-7 gap-3">
          {STAGES.map((stage) => {
            const cards = entries.filter((e) => e.stage === stage);
            return (
              <div
                key={stage}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => onDrop(e, stage)}
                className={`rounded-xl2 bg-surface border-t-2 ${STAGE_TONES[stage]} border-x border-b border-border p-3 min-h-[220px]`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs uppercase tracking-wider text-subtle font-medium">{stage}</div>
                  <span className="text-xs text-subtle">{cards.length}</span>
                </div>
                <div className="space-y-2">
                  {cards.length === 0 && <div className="text-xs text-subtle/60 italic px-1 py-2">{t('hrPipeline.dropHere')}</div>}
                  {cards.map((c) => (
                    <div
                      key={c.id}
                      draggable
                      onDragStart={(e) => onDragStart(e, c.id)}
                      className="rounded-lg border border-border bg-bg p-2.5 text-sm cursor-grab active:cursor-grabbing hover:border-brand-500/50"
                    >
                      <div className="font-medium">{t('hrPipeline.candidate', { id: c.candidateUserId })}</div>
                      {c.hrComment && <div className="text-xs text-subtle mt-1 line-clamp-2">{c.hrComment}</div>}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
