import { useCountUp, useInView } from '@/lib/hooks';

interface Stat {
  value: number;
  suffix?: string;
  label: string;
}

const STATS: Stat[] = [
  { value: 11, label: 'Domain entities' },
  { value: 40, suffix: '+', label: 'REST endpoints' },
  { value: 7,  label: 'Pipeline stages' },
  { value: 5,  label: 'Score dimensions' },
];

function StatCell({ stat, animate }: { stat: Stat; animate: boolean }) {
  const v = useCountUp(stat.value, 1500, animate);
  return (
    <div>
      <div className="text-3xl md:text-4xl font-semibold tracking-tight gradient-text tabular-nums">
        {v}{stat.suffix ?? ''}
      </div>
      <div className="mt-1 text-xs uppercase tracking-wider text-subtle">{stat.label}</div>
    </div>
  );
}

export default function Stats() {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <section className="border-y border-border bg-gradient-to-r from-brand-500/5 via-transparent to-sky-400/5">
      <div ref={ref} className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {STATS.map((s) => <StatCell key={s.label} stat={s} animate={inView} />)}
      </div>
    </section>
  );
}
