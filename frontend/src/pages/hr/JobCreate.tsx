import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button, Card, CardBody, CardHeader, Input, Select, Textarea, Toast } from '@/components/ui';
import { createJob } from '@/api/jobs';
import type { CandidateLevel } from '@/types/api';
import { apiErrorMessage } from '@/api/client';

export default function JobCreate() {
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
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <div>
        <h1 className="text-2xl font-semibold">Create a job</h1>
        <p className="text-sm text-subtle mt-1">Add the role description — AI will analyze must-have / nice-to-have skills.</p>
      </div>

      <Card>
        <CardHeader title="Job details" />
        <CardBody>
          <form onSubmit={submit} className="space-y-4">
            <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={200}
                   placeholder="e.g. Senior Backend Engineer (Spring Boot, Kafka)" />
            <Textarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} required
                      rows={10} placeholder="Responsibilities, requirements, must-have/nice-to-have skills..." />
            <div className="grid sm:grid-cols-3 gap-4">
              <Select label="Seniority" value={seniority} onChange={(e) => setSeniority(e.target.value as CandidateLevel)}>
                <option value="JUNIOR">Junior</option>
                <option value="MID">Mid</option>
                <option value="SENIOR">Senior</option>
              </Select>
              <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Baku, AZ" />
              <Select label="Employment" value={employmentType} onChange={(e) => setEmploymentType(e.target.value)}>
                <option value="FULL_TIME">Full-time</option>
                <option value="PART_TIME">Part-time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERN">Internship</option>
              </Select>
            </div>
            {error && <Toast kind="error">{error}</Toast>}
            <div className="flex gap-2 pt-2">
              <Button type="submit" loading={loading}>Create job</Button>
              <Button type="button" variant="ghost" onClick={() => nav(-1)}>Cancel</Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
