import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Brain,
  Eye,
  ShieldCheck,
  Sparkles,
  Target,
  Workflow,
  Zap,
  Sun,
  Moon,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui';
import BrandMark from '@/components/BrandMark';
import { useTheme } from '@/store/theme';

export default function Landing() {
  const { theme, toggle } = useTheme();

  return (
    <div className="min-h-screen bg-bg text-fg">
      {/* Top Nav */}
      <header className="sticky top-0 z-30 glass border-b border-border">
        <div className="max-w-6xl mx-auto h-16 px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <BrandMark size={32} />
            <span className="font-semibold tracking-tight">HireMind <span className="gradient-text">AI</span></span>
          </Link>
          <nav className="flex items-center gap-2">
            <button onClick={toggle}
              className="h-9 w-9 rounded-lg flex items-center justify-center text-subtle hover:text-fg hover:bg-fg/[0.06]"
              aria-label="Toggle theme">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Link to="/login"><Button variant="ghost" size="sm">Sign in</Button></Link>
            <Link to="/register"><Button size="sm" iconRight={<ArrowRight className="h-4 w-4" />}>Get started</Button></Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="app-mesh relative">
        <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center relative">
          <div className="inline-flex items-center gap-2 px-3 h-8 rounded-full bg-brand-500/10 text-brand-700 dark:text-brand-300 text-xs font-medium mb-7 ring-1 ring-brand-500/20 animate-fade-in-up">
            <Sparkles className="h-3.5 w-3.5" />
            Explainable AI for hiring teams
            <span className="w-px h-4 bg-brand-500/30" />
            <span>v0.1 · MVP</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05] animate-fade-in-up">
            Hiring decisions, <br className="hidden sm:block" />
            <span className="gradient-text">backed by AI</span>. <span>Not made by it.</span>
          </h1>

          <p className="mt-7 text-lg md:text-xl text-subtle max-w-2xl mx-auto leading-relaxed animate-fade-in-up">
            Read CVs. Understand jobs. Score candidates with reasons humans can verify.
            HireMind AI is a transparent, bias-aware HR assistant — not a replacement.
          </p>

          <div className="mt-10 flex items-center justify-center gap-3 flex-wrap animate-fade-in-up">
            <Link to="/register">
              <Button size="lg" iconRight={<ArrowRight className="h-4 w-4" />}>Start free</Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">I have an account</Button>
            </Link>
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-subtle">
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-brand-500" /> No credit card</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-brand-500" /> Self-hosted ready</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-brand-500" /> Bias-guarded scoring</span>
          </div>

          {/* Mock dashboard preview */}
          <div className="relative mt-16 max-w-5xl mx-auto animate-fade-in-up">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-500/30 via-sky-400/30 to-brand-500/30 rounded-3xl blur-2xl opacity-70 animate-gradient" style={{ backgroundSize: '200% 200%' }} />
            <div className="relative rounded-2xl border border-border bg-surface shadow-pop overflow-hidden">
              <div className="h-9 px-4 flex items-center gap-1.5 border-b border-border bg-muted/40">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="ml-3 text-[11px] text-subtle">hiremind.ai/app</span>
              </div>
              <div className="grid grid-cols-12 gap-4 p-5">
                <aside className="col-span-3 hidden md:block space-y-2 text-left">
                  {['Dashboard', 'Jobs', 'Candidates', 'Pipeline', 'Analytics'].map((it, i) => (
                    <div key={it} className={`text-xs px-3 h-8 rounded-md flex items-center gap-2 ${i === 0 ? 'bg-brand-500/10 text-brand-700 dark:text-brand-300 font-medium ring-1 ring-brand-500/20' : 'text-subtle'}`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
                      {it}
                    </div>
                  ))}
                </aside>
                <div className="col-span-12 md:col-span-9 space-y-4 text-left">
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-xs text-subtle">CANDIDATE · #1284</div>
                      <div className="text-base font-semibold mt-0.5">Senior Backend Engineer · Nigar M.</div>
                    </div>
                    <div className="inline-flex items-center gap-1 text-xs px-2 h-6 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
                      STRONG MATCH
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { l: 'Skills', v: 92 },
                      { l: 'Experience', v: 88 },
                      { l: 'Education', v: 80 },
                      { l: 'Domain', v: 75 },
                      { l: 'ATS', v: 90 },
                    ].map((s) => (
                      <div key={s.l} className="rounded-lg border border-border bg-bg/40 p-2">
                        <div className="text-[10px] uppercase tracking-wider text-subtle">{s.l}</div>
                        <div className="mt-0.5 text-lg font-semibold text-fg">{s.v}</div>
                        <div className="mt-1.5 h-1 bg-fg/[0.07] rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-brand-500 to-sky-400" style={{ width: `${s.v}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {['Spring Boot', 'Kafka', 'Redis', 'Docker', 'Microservices', 'JWT'].map((t) => (
                      <span key={t} className="text-[11px] px-2 h-6 rounded-md bg-brand-500/10 text-brand-700 dark:text-brand-300 font-medium inline-flex items-center">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 h-7 rounded-full bg-brand-500/10 text-brand-700 dark:text-brand-300 text-xs font-medium mb-4">
            <Zap className="h-3 w-3" /> Built for real HR workflows
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Everything HR needs. <span className="gradient-text">Nothing they have to fight.</span>
          </h2>
          <p className="mt-3 text-subtle">
            From CV upload to offer stage — semantic matching, explainable scores, and a kanban pipeline that fits how teams actually hire.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: Brain,       title: 'Explainable scoring',      body: 'Every match shows breakdown — skills, experience, education, domain, ATS — with HR-readable reasoning.' },
            { icon: Workflow,    title: 'Pipeline that fits HR',    body: 'NEW → REVIEWED → SHORTLISTED → INTERVIEW → OFFER → HIRED. Drag-drop, comments, audit trail.' },
            { icon: Target,      title: 'Job-aware matching',       body: 'Job descriptions parsed into must-have / nice-to-have skills. Candidates ranked by semantic fit.' },
            { icon: ShieldCheck, title: 'Bias guard',               body: 'Age, gender, photo, nationality are masked from scoring with explicit warnings to HR.' },
            { icon: Eye,         title: 'Human-in-the-loop',        body: 'AI provides decision support — never the final call. Confidence scores tell HR when to dig deeper.' },
            { icon: Sparkles,    title: 'CV rewrite assistant',     body: 'Concrete before/after rewrites tied to job requirements, never generic prose.' },
          ].map((f, i) => (
            <div
              key={f.title}
              className="glow-card group relative rounded-xl2 border border-border bg-surface p-6 shadow-card overflow-hidden"
              style={{ animation: `fadeInUp 0.5s ${i * 60}ms both` }}
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

      {/* Numbers strip */}
      <section className="border-y border-border bg-gradient-to-r from-brand-500/5 via-transparent to-sky-400/5">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { v: '11', l: 'Domain entities' },
            { v: '40+', l: 'REST endpoints' },
            { v: '7', l: 'Pipeline stages' },
            { v: '5', l: 'Score dimensions' },
          ].map((s) => (
            <div key={s.l}>
              <div className="text-3xl md:text-4xl font-semibold tracking-tight gradient-text">{s.v}</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-subtle">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">
          Ready to <span className="gradient-text">screen smarter?</span>
        </h2>
        <p className="mt-4 text-subtle max-w-xl mx-auto">
          Spin up the demo, log in as HR or Candidate, upload a CV, and watch HireMind AI do its thing.
        </p>
        <div className="mt-8 flex justify-center gap-3 flex-wrap">
          <Link to="/register"><Button size="lg" iconRight={<ArrowRight className="h-4 w-4" />}>Create account</Button></Link>
          <Link to="/login"><Button size="lg" variant="outline">Sign in</Button></Link>
        </div>
        <div className="mt-5 inline-flex items-center gap-2 text-xs text-subtle px-3 h-7 rounded-full bg-fg/[0.04]">
          <span className="font-mono">hr@hiremind.ai</span> / <span className="font-mono">Hr123456!</span>
          <span className="opacity-60">·</span>
          <span className="font-mono">candidate@hiremind.ai</span> / <span className="font-mono">Cand123!</span>
        </div>
      </section>

      <footer className="border-t border-border py-10 text-center text-xs text-subtle">
        <div className="flex items-center justify-center gap-2 mb-2">
          <BrandMark size={22} />
          <span className="font-medium">HireMind AI</span>
        </div>
        © {new Date().getFullYear()} HireMind AI · Built on Spring Boot + React
      </footer>
    </div>
  );
}
