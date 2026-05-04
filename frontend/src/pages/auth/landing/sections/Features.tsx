import { Brain, Eye, ShieldCheck, Sparkles, Target, Workflow, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useInView } from '@/lib/hooks';

export default function Features() {
  const { t } = useTranslation();
  const [ref, inView] = useInView<HTMLDivElement>();

  const features = [
    { icon: Brain,       title: 'Explainable scoring',      body: 'Every match shows breakdown — skills, experience, education, domain, ATS — with HR-readable reasoning.' },
    { icon: Workflow,    title: 'Pipeline that fits HR',    body: 'NEW → REVIEWED → SHORTLISTED → INTERVIEW → OFFER → HIRED. Drag-drop, comments, audit trail.' },
    { icon: Target,      title: 'Job-aware matching',       body: 'Job descriptions parsed into must-have / nice-to-have skills. Candidates ranked by semantic fit.' },
    { icon: ShieldCheck, title: 'Bias guard',               body: 'Age, gender, photo, nationality are masked from scoring with explicit warnings to HR.' },
    { icon: Eye,         title: 'Human-in-the-loop',        body: 'AI provides decision support — never the final call. Confidence scores tell HR when to dig deeper.' },
    { icon: Sparkles,    title: 'CV rewrite assistant',     body: 'Concrete before/after rewrites tied to job requirements, never generic prose.' },
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 py-24" ref={ref}>
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 h-7 rounded-full bg-brand-500/10 text-brand-700 dark:text-brand-300 text-xs font-medium mb-4">
          <Zap className="h-3 w-3" /> Built for real HR workflows
        </div>
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
          {t('landing.featuresTitle1')} <span className="gradient-text">{t('landing.featuresTitle2')}</span>
        </h2>
        <p className="mt-3 text-subtle">{t('landing.featuresSub')}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {features.map((f, i) => (
          <div
            key={f.title}
            className={`glow-card group relative rounded-xl2 border border-border bg-surface p-6 shadow-card overflow-hidden transition-all duration-700 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-brand-500/15 to-sky-400/10 text-brand-600 dark:text-brand-300 flex items-center justify-center mb-4 ring-1 ring-brand-500/20">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="font-semibold tracking-tight">{f.title}</h3>
            <p className="mt-1.5 text-sm text-subtle leading-relaxed">{f.body}</p>
            <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-brand-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
    </section>
  );
}
