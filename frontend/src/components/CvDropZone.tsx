import { useRef, useState, type DragEvent } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ACCEPTED = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
const MAX_BYTES = 10 * 1024 * 1024;

type Phase = 'idle' | 'uploading' | 'success' | 'error';

interface Props {
  onFile: (file: File, onProgress: (p: number) => void) => Promise<void>;
}

export default function CvDropZone({ onFile }: Props) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [phase, setPhase] = useState<Phase>('idle');
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState<string | null>(null);

  function validate(file: File): string | null {
    if (file.size > MAX_BYTES) return t('cv.tooLarge');
    if (file.type && !ACCEPTED.includes(file.type)) {
      const ext = file.name.toLowerCase().split('.').pop();
      if (!['pdf', 'doc', 'docx', 'txt'].includes(ext ?? '')) return t('cv.invalidType');
    }
    return null;
  }

  async function handleFile(file: File) {
    const err = validate(file);
    if (err) {
      setError(err);
      setPhase('error');
      return;
    }
    setError(null);
    setFileName(file.name);
    setProgress(0);
    setPhase('uploading');
    try {
      await onFile(file, (p) => setProgress(p));
      setPhase('success');
      setTimeout(() => {
        setPhase('idle');
        setProgress(0);
        setFileName('');
      }, 1600);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
      setPhase('error');
    }
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      onClick={() => phase === 'idle' && inputRef.current?.click()}
      className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden
        ${dragOver
          ? 'border-brand-500 bg-brand-500/10 scale-[1.01]'
          : 'border-border bg-surface hover:border-brand-500/50 hover:bg-fg/[0.02]'}
        ${phase === 'success' ? 'border-emerald-500/60 bg-emerald-500/5' : ''}
        ${phase === 'error' ? 'border-red-500/60 bg-red-500/5' : ''}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,application/pdf"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          if (inputRef.current) inputRef.current.value = '';
        }}
      />

      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-30 dot-grid"
      />

      <div className="relative px-6 py-12 md:py-16 flex flex-col items-center text-center">
        {phase === 'idle' && (
          <>
            <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br from-brand-500/20 to-sky-400/20 ring-1 ring-brand-500/30 flex items-center justify-center text-brand-600 dark:text-brand-300 mb-4 transition-transform ${dragOver ? 'scale-110' : ''}`}>
              <UploadCloud className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-semibold tracking-tight">
              {dragOver ? t('cv.dropActive') : t('cv.dropTitle')}
            </h3>
            <p className="mt-1 text-sm text-subtle">{t('cv.dropSub')}</p>
            <p className="mt-3 text-xs text-subtle/80 font-mono">{t('cv.dropHint')}</p>
          </>
        )}

        {phase === 'uploading' && (
          <>
            <div className="h-16 w-16 rounded-2xl bg-brand-500/15 ring-1 ring-brand-500/30 flex items-center justify-center text-brand-600 dark:text-brand-300 mb-4">
              <Loader2 className="h-7 w-7 animate-spin" />
            </div>
            <h3 className="text-base font-semibold">{t('cv.uploading')}</h3>
            <p className="mt-1 text-sm text-subtle inline-flex items-center gap-2">
              <FileText className="h-4 w-4" /> <span className="truncate max-w-[260px]">{fileName}</span>
            </p>
            <div className="mt-4 w-full max-w-md h-2 bg-fg/[0.07] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-500 to-sky-400 transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-2 text-xs text-subtle tabular-nums">{progress}%</div>
          </>
        )}

        {phase === 'success' && (
          <>
            <div className="h-16 w-16 rounded-2xl bg-emerald-500/15 ring-1 ring-emerald-500/30 flex items-center justify-center text-emerald-500 mb-4 animate-fade-in-up">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h3 className="text-base font-semibold">{t('cv.parsed')}</h3>
            <p className="mt-1 text-sm text-subtle inline-flex items-center gap-2">
              <FileText className="h-4 w-4" /> <span className="truncate max-w-[260px]">{fileName}</span>
            </p>
            <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">{t('cv.autoAnalyzing')}</p>
          </>
        )}

        {phase === 'error' && (
          <>
            <div className="h-16 w-16 rounded-2xl bg-red-500/15 ring-1 ring-red-500/30 flex items-center justify-center text-red-500 mb-4">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <h3 className="text-base font-semibold">{t('cv.failed')}</h3>
            <p className="mt-1 text-sm text-red-500 max-w-md">{error}</p>
            <button
              onClick={(e) => { e.stopPropagation(); setPhase('idle'); setError(null); }}
              className="mt-4 text-sm text-brand-600 dark:text-brand-300 hover:underline"
            >
              {t('cv.chooseFile')}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
