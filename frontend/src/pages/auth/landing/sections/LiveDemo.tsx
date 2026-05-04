import { useInView } from '@/lib/hooks';

export default function LiveDemo() {
  const [ref, inView] = useInView<HTMLDivElement>();

  return (
    <section className="max-w-6xl mx-auto px-6 -mt-6 md:-mt-12 relative pb-16">
      <div ref={ref} className={`relative max-w-5xl mx-auto transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
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
                ].map((s, idx) => (
                  <div key={s.l} className="rounded-lg border border-border bg-bg/40 p-2">
                    <div className="text-[10px] uppercase tracking-wider text-subtle">{s.l}</div>
                    <div className="mt-0.5 text-lg font-semibold text-fg">{inView ? s.v : 0}</div>
                    <div className="mt-1.5 h-1 bg-fg/[0.07] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-brand-500 to-sky-400 transition-all duration-1000 ease-out"
                        style={{ width: `${inView ? s.v : 0}%`, transitionDelay: `${200 + idx * 80}ms` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['Spring Boot', 'Kafka', 'Redis', 'Docker', 'Microservices', 'JWT'].map((tk) => (
                  <span key={tk} className="text-[11px] px-2 h-6 rounded-md bg-brand-500/10 text-brand-700 dark:text-brand-300 font-medium inline-flex items-center">{tk}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
