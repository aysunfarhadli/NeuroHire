import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass, X, ArrowRight, ArrowLeft,
  Search, UserPlus, UploadCloud, Brain, MessageSquare,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const TOUR_KEY = 'hm_tour_seen_v1';

type Step = {
  icon: typeof Compass;
  titleKey: string;
  bodyKey: string;
  illo: () => JSX.Element;
};

function StepIlloBrowse() {
  return (
    <div className="rounded-xl border border-border bg-bg/40 p-4">
      <div className="flex items-center gap-2 px-2 h-9 rounded-lg bg-fg/[0.04] mb-2">
        <Search className="h-4 w-4 text-subtle" />
        <span className="text-xs text-subtle">Senior backend engineer</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-md border border-border bg-surface p-2.5">
            <div className="h-2 w-3/5 bg-fg/[0.1] rounded mb-1.5" />
            <div className="h-1.5 w-2/5 bg-fg/[0.07] rounded mb-2" />
            <div className="flex gap-1">
              <span className="h-4 w-12 rounded bg-brand-500/15" />
              <span className="h-4 w-10 rounded bg-emerald-500/15" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepIlloRegister() {
  return (
    <div className="rounded-xl border border-border bg-bg/40 p-5 max-w-xs mx-auto">
      <div className="text-xs uppercase tracking-wider text-subtle mb-2">Create account</div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-8 rounded-md bg-fg/[0.05] mb-2" />
      ))}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="h-9 rounded-md ring-2 ring-brand-500/40 bg-brand-500/10 flex items-center justify-center text-[11px] font-medium text-brand-600 dark:text-brand-300">Candidate</div>
        <div className="h-9 rounded-md bg-fg/[0.05] flex items-center justify-center text-[11px] text-subtle">HR</div>
      </div>
      <div className="h-9 rounded-md bg-gradient-to-br from-brand-500 to-brand-700" />
    </div>
  );
}

function StepIlloUpload() {
  return (
    <div className="rounded-xl border-2 border-dashed border-brand-500/40 bg-brand-500/5 p-6 text-center">
      <div className="mx-auto h-12 w-12 rounded-xl bg-brand-500/15 ring-1 ring-brand-500/30 flex items-center justify-center text-brand-600 dark:text-brand-300 mb-2">
        <UploadCloud className="h-5 w-5" />
      </div>
      <div className="text-xs font-medium">Drop your CV here</div>
      <div className="text-[11px] text-subtle">PDF · DOCX · TXT</div>
      <div className="mt-3 mx-auto max-w-[140px] h-1.5 bg-fg/[0.08] rounded-full overflow-hidden">
        <div className="h-full w-3/4 bg-gradient-to-r from-brand-500 to-sky-400 animate-pulse" />
      </div>
    </div>
  );
}

function StepIlloAnalysis() {
  return (
    <div className="rounded-xl border border-border bg-bg/40 p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-subtle">Match score</div>
          <div className="text-2xl font-semibold gradient-text">87</div>
        </div>
        <span className="text-[10px] px-2 h-5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-medium inline-flex items-center">STRONG MATCH</span>
      </div>
      <div className="grid grid-cols-5 gap-1.5">
        {[92, 88, 80, 75, 90].map((v, i) => (
          <div key={i} className="rounded bg-fg/[0.04] p-1.5">
            <div className="text-[8px] text-subtle">D{i + 1}</div>
            <div className="text-sm font-semibold">{v}</div>
            <div className="mt-1 h-0.5 bg-fg/[0.07] rounded">
              <div className="h-full bg-brand-500 rounded" style={{ width: `${v}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepIlloChat() {
  return (
    <div className="rounded-xl border border-border bg-bg/40 p-3 space-y-1.5">
      <div className="bg-fg/[0.05] text-[11px] rounded-2xl rounded-tl-sm px-2.5 py-1.5 max-w-[80%]">
        Hi! I can review your CV or find matching jobs.
      </div>
      <div className="bg-brand-500 text-white text-[11px] rounded-2xl rounded-tr-sm px-2.5 py-1.5 max-w-[60%] ml-auto">
        Find me remote roles
      </div>
      <div className="bg-fg/[0.05] rounded-2xl rounded-tl-sm px-2.5 py-1.5 max-w-[55%] inline-flex gap-1">
        <span className="h-1 w-1 rounded-full bg-subtle animate-pulse" />
        <span className="h-1 w-1 rounded-full bg-subtle animate-pulse [animation-delay:120ms]" />
        <span className="h-1 w-1 rounded-full bg-subtle animate-pulse [animation-delay:240ms]" />
      </div>
    </div>
  );
}

const STEPS: Step[] = [
  { icon: Search,        titleKey: 'tour.step1Title', bodyKey: 'tour.step1Body', illo: StepIlloBrowse },
  { icon: UserPlus,      titleKey: 'tour.step2Title', bodyKey: 'tour.step2Body', illo: StepIlloRegister },
  { icon: UploadCloud,   titleKey: 'tour.step3Title', bodyKey: 'tour.step3Body', illo: StepIlloUpload },
  { icon: Brain,         titleKey: 'tour.step4Title', bodyKey: 'tour.step4Body', illo: StepIlloAnalysis },
  { icon: MessageSquare, titleKey: 'tour.step5Title', bodyKey: 'tour.step5Body', illo: StepIlloChat },
];

export function useTour() {
  const [open, setOpen] = useState(false);
  return {
    open,
    start: () => setOpen(true),
    close: () => setOpen(false),
    seen: typeof window !== 'undefined' && localStorage.getItem(TOUR_KEY) === '1',
  };
}

export function markTourSeen() {
  try { localStorage.setItem(TOUR_KEY, '1'); } catch { /* private mode */ }
}

interface Props { open: boolean; onClose: () => void; }

export default function OnboardingTour({ open, onClose }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (open) setStep(0);
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && step < STEPS.length - 1) setStep((s) => s + 1);
      if (e.key === 'ArrowLeft' && step > 0) setStep((s) => s - 1);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, step, onClose]);

  if (!open) return null;
  const s = STEPS[step];
  const isLast = step === STEPS.length - 1;

  function finish() {
    markTourSeen();
    onClose();
    if (step === 0) navigate('/jobs');
    else if (step === 2) navigate('/register');
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-surface shadow-pop overflow-hidden">
        <button
          onClick={() => { markTourSeen(); onClose(); }}
          className="absolute top-3 right-3 h-8 w-8 rounded-lg flex items-center justify-center text-subtle hover:text-fg hover:bg-fg/[0.06] z-10"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="px-7 pt-7">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center shadow-glow">
              <s.icon className="h-4 w-4" />
            </div>
            <div className="text-[11px] uppercase tracking-wider text-subtle font-mono">
              {step + 1} / {STEPS.length}
            </div>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">{t(s.titleKey)}</h2>
          <p className="mt-2 text-sm text-subtle leading-relaxed">{t(s.bodyKey)}</p>
        </div>

        <div className="px-7 py-5">
          <s.illo />
        </div>

        <div className="px-7 pb-5 pt-2 flex items-center gap-1.5">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? 'w-7 bg-brand-500' : i < step ? 'w-3 bg-brand-500/40' : 'w-3 bg-fg/[0.08] hover:bg-fg/[0.15]'
              }`}
              aria-label={`Step ${i + 1}`}
            />
          ))}
        </div>

        <div className="px-7 py-4 border-t border-border flex items-center justify-between bg-fg/[0.02]">
          <button
            onClick={() => { markTourSeen(); onClose(); }}
            className="text-sm text-subtle hover:text-fg"
          >
            {t('tour.skip')}
          </button>
          <div className="flex gap-2">
            {step > 0 && (
              <button
                onClick={() => setStep((x) => x - 1)}
                className="h-9 px-3 rounded-lg text-sm border border-border hover:bg-fg/[0.04] flex items-center gap-1.5"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> {t('tour.prev')}
              </button>
            )}
            {!isLast ? (
              <button
                onClick={() => setStep((x) => x + 1)}
                className="h-9 px-4 rounded-lg text-sm bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow flex items-center gap-1.5 hover:shadow-pop"
              >
                {t('tour.next')} <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                onClick={finish}
                className="h-9 px-4 rounded-lg text-sm bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-glow flex items-center gap-1.5 hover:shadow-pop"
              >
                {t('tour.finish')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
