import { Quote, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useInView } from '@/lib/hooks';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  initials: string;
  accent: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Aysel Mammadova',
    role: 'Head of People',
    company: 'Nimbus Cloud',
    quote: '"We screened 240 backend applicants in two weeks — HireMind ranked our top 12 within 30 minutes of CV upload. The bias-guard was the deciding factor for procurement."',
    initials: 'AM',
    accent: 'from-brand-500/30 to-sky-400/30',
  },
  {
    name: 'Ravi Subramaniam',
    role: 'Hiring Manager',
    company: 'Verdant Health',
    quote: '"The score breakdown means I can defend every shortlist decision. My recruiters used to argue with each other — now they argue with the rubric."',
    initials: 'RS',
    accent: 'from-emerald-500/30 to-brand-500/30',
  },
  {
    name: 'Lara Petrov',
    role: 'Talent Lead',
    company: 'Atlas Financial',
    quote: '"Self-hosted in our VPC in a weekend. The OpenAI swap-out for our internal Llama deployment was a config change. Engineering was thrilled."',
    initials: 'LP',
    accent: 'from-amber-500/30 to-brand-500/30',
  },
  {
    name: 'Naomi Chen',
    role: 'Senior Recruiter',
    company: 'Orbit Media',
    quote: '"The candidate feedback panel actually got us thank-you emails from rejected applicants. That is a first in 8 years of recruiting."',
    initials: 'NC',
    accent: 'from-violet-500/30 to-brand-500/30',
  },
];

export default function Testimonials() {
  const { t } = useTranslation();
  const [ref, inView] = useInView<HTMLDivElement>();

  return (
    <section className="max-w-6xl mx-auto px-6 py-24" ref={ref}>
      <div className="text-center max-w-2xl mx-auto mb-14">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">{t('landing.testimonialsTitle')}</h2>
        <p className="mt-3 text-subtle">{t('landing.testimonialsSub')}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {TESTIMONIALS.map((tn, i) => (
          <div
            key={tn.name}
            className={`relative rounded-2xl border border-border bg-surface p-6 shadow-card transition-all duration-700 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <Quote className="absolute top-5 right-5 h-6 w-6 text-brand-500/20" />
            <div className="flex items-center gap-1 text-amber-400 mb-3">
              {Array.from({ length: 5 }).map((_, k) => (<Star key={k} className="h-4 w-4 fill-current" />))}
            </div>
            <p className="text-fg/90 leading-relaxed">{tn.quote}</p>
            <div className="mt-5 flex items-center gap-3">
              <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${tn.accent} ring-1 ring-border flex items-center justify-center text-sm font-semibold text-fg`}>
                {tn.initials}
              </div>
              <div>
                <div className="text-sm font-semibold">{tn.name}</div>
                <div className="text-xs text-subtle">{tn.role} · {tn.company}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
