import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button, Card, CardBody, CardHeader, Input, Select, Textarea, Toast } from '@/components/ui';
import { createJob } from '@/api/jobs';
import type { CandidateLevel } from '@/types/api';
import { apiErrorMessage } from '@/api/client';

export default function JobCreate() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [seniority, setSeniority] = useState<CandidateLevel | ''>('MID');
  const [location, setLocation] = useState('');
  const [employmentType, setEmploymentType] = useState('FULL_TIME');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const j = await createJob({
        title, description,
        seniority: seniority === '' ? undefined : seniority,
        location: location || undefined,
        employmentType: employmentType || undefined,
      });
      nav(`/app/jobs/${j.id}`);
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <button onClick={() => nav(-1)} className="inline-flex items-center gap-2 text-sm text-subtle hover:text-fg">
        <ArrowLeft className="h-4 w-4" /> {t('common.back')}
      </button>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t('hrJobs.createTitle')}</h1>
        <p className="text-sm text-subtle mt-1">{t('hrJobs.createSub')}</p>
      </div>

      <Card>
        <CardHeader title={t('hrJobs.formCard')} />
        <CardBody>
          <form onSubmit={submit} className="space-y-4">
            <Input label={t('hrJobs.fTitle')} value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={200}
                   placeholder={t('hrJobs.fTitlePh') ?? ''} />
            <Textarea label={t('hrJobs.fDesc')} value={description} onChange={(e) => setDescription(e.target.value)} required
                      rows={10} placeholder={t('hrJobs.fDescPh') ?? ''} />
            <div className="grid sm:grid-cols-3 gap-4">
              <Select label={t('hrJobs.fSeniority')} value={seniority} onChange={(e) => setSeniority(e.target.value as CandidateLevel)}>
                <option value="JUNIOR">{t('hrJobs.junior')}</option>
                <option value="MID">{t('hrJobs.mid')}</option>
                <option value="SENIOR">{t('hrJobs.senior')}</option>
              </Select>
              <Input label={t('hrJobs.fLocation')} value={location} onChange={(e) => setLocation(e.target.value)} placeholder={t('hrJobs.fLocationPh') ?? ''} />
              <Select label={t('hrJobs.fEmployment')} value={employmentType} onChange={(e) => setEmploymentType(e.target.value)}>
                <option value="FULL_TIME">{t('hrJobs.fullTime')}</option>
                <option value="PART_TIME">{t('hrJobs.partTime')}</option>
                <option value="CONTRACT">{t('hrJobs.contract')}</option>
                <option value="INTERN">{t('hrJobs.intern')}</option>
              </Select>
            </div>
            {error && <Toast kind="error">{error}</Toast>}
            <div className="flex gap-2 pt-2">
              <Button type="submit" loading={loading}>{t('hrJobs.createBtn')}</Button>
              <Button type="button" variant="ghost" onClick={() => nav(-1)}>{t('hrJobs.cancel')}</Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
