import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Trash2, Upload } from 'lucide-react';
import { Badge, Button, Card, CardBody, CardHeader, EmptyState, Skeleton, Toast } from '@/components/ui';
import { deleteCv, myCvs, uploadCv } from '@/api/cv';
import type { CvSummary } from '@/types/api';
import { formatBytes, relativeTime } from '@/lib/format';
import { apiErrorMessage } from '@/api/client';

export default function CvList() {
  const [cvs, setCvs] = useState<CvSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    try { setCvs(await myCvs()); } catch (e) { setError(apiErrorMessage(e)); }
  }

  useEffect(() => { load(); }, []);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      await uploadCv(file);
      if (fileRef.current) fileRef.current.value = '';
      await load();
      // re-poll to catch parsing completion
      setTimeout(load, 1500);
      setTimeout(load, 4000);
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setUploading(false);
    }
  }

  async function onDelete(id: number) {
    if (!confirm('Delete this CV?')) return;
    try { await deleteCv(id); await load(); } catch (e) { setError(apiErrorMessage(e)); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">My CVs</h1>
          <p className="text-sm text-subtle mt-1">Upload PDF or DOCX. Parsing and AI analysis happen automatically.</p>
        </div>
        <input ref={fileRef} type="file" accept=".pdf,.docx,.doc,.txt,application/pdf" className="hidden" onChange={onPick} />
        <Button onClick={() => fileRef.current?.click()} loading={uploading} iconLeft={<Upload className="h-4 w-4" />}>
          {uploading ? 'Uploading...' : 'Upload CV'}
        </Button>
      </div>

      {error && <Toast kind="error">{error}</Toast>}

      <Card>
        <CardHeader title="All CVs" subtitle="Most recent first" />
        <CardBody className="p-0">
          {cvs === null ? (
            <div className="p-5 space-y-3">
              <Skeleton className="h-12" /><Skeleton className="h-12" /><Skeleton className="h-12" />
            </div>
          ) : cvs.length === 0 ? (
            <EmptyState
              icon={<FileText className="h-6 w-6" />}
              title="No CVs yet"
              description="Upload your first CV to receive AI analysis, missing-skills suggestions, and rewrite recommendations."
              action={<Button onClick={() => fileRef.current?.click()} iconLeft={<Upload className="h-4 w-4" />}>Upload CV</Button>}
            />
          ) : (
            <ul className="divide-y divide-border">
              {cvs.map((cv) => (
                <li key={cv.id} className="flex items-center justify-between px-5 py-3.5">
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
                    {cv.parsingStatus === 'DONE' && <Badge tone="green">Parsed</Badge>}
                    {cv.parsingStatus === 'PROCESSING' && <Badge tone="blue">Processing</Badge>}
                    {cv.parsingStatus === 'PENDING' && <Badge tone="amber">Pending</Badge>}
                    {cv.parsingStatus === 'FAILED' && <Badge tone="red">Failed</Badge>}
                    <button onClick={() => onDelete(cv.id)} className="h-8 w-8 rounded-md hover:bg-red-500/10 text-subtle hover:text-red-500 flex items-center justify-center" aria-label="Delete">
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
