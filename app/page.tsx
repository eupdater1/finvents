import Link from 'next/link'
import { ArrowRight, Banknote, BarChart3, Bitcoin, Building2, CalendarCheck2, CheckCircle2, Landmark, SearchCheck, ShieldCheck } from 'lucide-react'
import { EventList } from '@/components/event-components'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { Button } from '@/components/ui/button'

const categories = [
  { name: 'Central Banks', count: '38 events', icon: Landmark, copy: 'Rate decisions, minutes and speeches' },
  { name: 'Tax Deadlines', count: '64 deadlines', icon: Banknote, copy: 'Filing and payment dates by country' },
  { name: 'Economic Data', count: '126 releases', icon: BarChart3, copy: 'Inflation, jobs, growth and trade' },
  { name: 'Crypto', count: '29 events', icon: Bitcoin, copy: 'Network upgrades and regulatory dates' },
  { name: 'Markets', count: '45 events', icon: Building2, copy: 'Holidays, settlements and index changes' },
]

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="border-b bg-secondary">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:px-6 md:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div className="flex flex-col gap-6">
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">Global finance calendar · UTC</p>
              <h1 className="text-balance text-5xl font-semibold tracking-tight md:text-7xl">The dates that move money.</h1>
              <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">A clear, source-verified calendar of central bank decisions, tax deadlines, economic releases, and market events across the world.</p>
              <div className="flex flex-wrap gap-3"><Button size="lg">Explore the calendar<ArrowRight data-icon="inline-end" aria-hidden="true" /></Button><Button size="lg" variant="outline">Choose your regions</Button></div>
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-muted-foreground"><span className="flex items-center gap-1.5"><ShieldCheck aria-hidden="true" />Primary sources</span><span className="flex items-center gap-1.5"><CalendarCheck2 aria-hidden="true" />Daily verification</span><span className="flex items-center gap-1.5"><CheckCircle2 aria-hidden="true" />Plain-language context</span></div>
            </div>
            <div className="grid grid-cols-2 overflow-hidden rounded-xl border bg-background md:grid-cols-4">
              {[['76','Countries'],['302','July events'],['18','Central banks'],['24h','Update cycle']].map(([value,label]) => <div key={label} className="border-b border-r p-5 last:border-r-0 md:border-b-0"><p className="font-mono text-3xl font-semibold tracking-tight">{value}</p><p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p></div>)}
            </div>
          </div>
        </section>

        <section id="week" className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
          <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><p className="text-xs font-semibold uppercase tracking-wider text-primary">July 20–26, 2026</p><h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">This week&apos;s key events</h2><p className="mt-2 text-muted-foreground">Times shown in Coordinated Universal Time (UTC).</p></div><Link href="#" className="flex items-center gap-2 text-sm font-semibold text-primary">View full calendar<ArrowRight aria-hidden="true" /></Link></div>
          <EventList />
        </section>

        <section id="categories" className="border-y bg-secondary">
          <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
            <div className="mb-8 max-w-xl"><p className="text-xs font-semibold uppercase tracking-wider text-primary">Browse by topic</p><h2 className="mt-2 text-balance text-3xl font-semibold tracking-tight md:text-4xl">One calendar, every financial deadline</h2></div>
            <div className="grid gap-px overflow-hidden rounded-xl border bg-border md:grid-cols-2 lg:grid-cols-5">{categories.map(({name,count,icon:Icon,copy}) => <Link key={name} href="#week" className="group flex min-h-56 flex-col justify-between bg-card p-5 hover:bg-background"><div className="flex items-start justify-between"><span className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground"><Icon aria-hidden="true" /></span><ArrowRight aria-hidden="true" className="text-muted-foreground transition-transform group-hover:translate-x-1" /></div><div><p className="font-semibold">{name}</p><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{copy}</p><p className="mt-4 font-mono text-xs font-semibold uppercase tracking-wider text-primary">{count}</p></div></Link>)}</div>
          </div>
        </section>

        <section id="methodology" className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:px-6 md:py-24 lg:grid-cols-[0.8fr_1.2fr]">
          <div><p className="text-xs font-semibold uppercase tracking-wider text-primary">How Finvents works</p><h2 className="mt-3 text-balance text-4xl font-semibold tracking-tight">Useful data starts with a reliable source.</h2><p className="mt-5 text-lg leading-relaxed text-muted-foreground">We prioritize official institutions, label uncertainty, and explain each event without jargon or prediction.</p></div>
          <div className="grid gap-8 md:grid-cols-3">{[
            [SearchCheck,'01','Collect','Dates are gathered from central banks, tax agencies, statistical offices, exchanges, and official project channels.'],
            [ShieldCheck,'02','Verify','Our team checks schedules against primary sources and records when each entry was last reviewed.'],
            [BarChart3,'03','Explain','We add neutral context, historical data, and practical impact without offering personalized advice.'],
          ].map(([Icon,num,title,copy]) => { const StepIcon = Icon as typeof SearchCheck; return <article key={String(num)} className="border-t-2 border-primary pt-5"><div className="flex items-center justify-between"><StepIcon aria-hidden="true" className="text-primary" /><span className="font-mono text-xs text-muted-foreground">{String(num)}</span></div><h3 className="mt-8 text-xl font-semibold">{String(title)}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{String(copy)}</p></article> })}</div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
