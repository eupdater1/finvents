import Link from 'next/link'
import { ArrowRight, Banknote, BarChart3, Bitcoin, Building2, CalendarCheck2, CheckCircle2, Landmark, SearchCheck, ShieldCheck } from 'lucide-react'
import { EventList } from '@/components/event-components'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { Button } from '@/components/ui/button'
import cpiEvent from '@/events-data/cpi-release-2026-08.json'
import taxEvent from '@/events-data/federal-tax-filing-deadline-2026.json'
import fomcSepEvent from '@/events-data/fomc-meeting-2026-09.json'
import fomcDecEvent from '@/events-data/fomc-meeting-2026-12.json'
import gdpEvent from '@/events-data/gdp-release-2026-07.json'
import jobsEvent from '@/events-data/jobs-report-2026-08.json'

const homepageEvents = [
  { ...cpiEvent, slug: 'cpi-release' },
  { ...taxEvent, slug: 'federal-tax-filing-deadline' },
  { ...fomcSepEvent, slug: 'fomc-interest-rate-decision-fomc-meeting-2026-09' },
  { ...fomcDecEvent, slug: 'fomc-interest-rate-decision-fomc-meeting-2026-12' },
  { ...gdpEvent, slug: 'gdp-release' },
  { ...jobsEvent, slug: 'jobs-report-non-farm-payrolls' },
]

type HomepageEvent = typeof homepageEvents[number]

const categories = [
  { name: 'Central Banks', icon: Landmark, copy: 'Rate decisions, minutes and speeches', filter: (event: HomepageEvent) => event.category === 'central_bank' },
  { name: 'Tax Deadlines', icon: Banknote, copy: 'Filing and payment dates by country', filter: (event: HomepageEvent) => event.pillar === 'taxes' || event.category === 'government_policy' },
  { name: 'Economic Data', icon: BarChart3, copy: 'Inflation, jobs, growth and trade', filter: (event: HomepageEvent) => event.category === 'economic_indicator' },
  { name: 'Crypto', icon: Bitcoin, copy: 'Network upgrades and regulatory dates', filter: () => false },
  { name: 'Markets', icon: Building2, copy: 'Holidays, settlements and index changes', filter: () => false },
]

function getEventType(event: HomepageEvent) {
  if (event.category === 'central_bank') return 'Central Bank'
  if (event.pillar === 'taxes' || event.category === 'government_policy') return 'Tax Deadline'
  if (event.category === 'economic_indicator') return 'Economic Data'
  return 'Event'
}

function getEventDetail(event: HomepageEvent) {
  if (event.category === 'central_bank') return 'FOMC meeting'
  if (event.pillar === 'taxes' || event.category === 'government_policy') return 'Annual deadline'
  if (event.recurrence === 'monthly') return 'Monthly release'
  if (event.recurrence === 'quarterly') return 'Quarterly release'
  return 'Release'
}

function formatDateValue(dateString: string) {
  const date = new Date(dateString)
  return String(date.getUTCDate()).padStart(2, '0')
}

function formatWeekday(dateString: string) {
  return new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'UTC' })
    .format(new Date(dateString))
    .toUpperCase()
}

function formatTime(dateString: string) {
  return new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC', hour12: false })
    .format(new Date(dateString))
}

function formatMonthLabel(date: Date) {
  return new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date)
}

export default function Page() {
  const now = new Date()
  const monthName = formatMonthLabel(now)
  const countryCount = new Set(homepageEvents.map((event) => event.country).filter(Boolean)).size
  const liveThisMonth = homepageEvents.filter((event) => {
    const date = new Date(event.event_date_utc || event.event_date)
    return date.getUTCFullYear() === now.getUTCFullYear() && date.getUTCMonth() === now.getUTCMonth() && date >= now
  }).length
  const centralBankCount = homepageEvents.filter((event) => event.category === 'central_bank').length
  const upcomingStart = new Date(now)
  upcomingStart.setUTCDate(upcomingStart.getUTCDate() + 7)
  const upcomingEnd = new Date(now)
  upcomingEnd.setUTCDate(upcomingEnd.getUTCDate() + 14)
  const upcomingEvents = homepageEvents
    .filter((event) => {
      const date = new Date(event.event_date_utc || event.event_date)
      return date >= upcomingStart && date <= upcomingEnd
    })
    .sort((a, b) => new Date(a.event_date_utc || a.event_date).getTime() - new Date(b.event_date_utc || b.event_date).getTime())

  const statItems = [
    { value: String(countryCount), label: countryCount === 1 ? 'Country' : 'Countries' },
    { value: String(liveThisMonth), label: `${monthName} events` },
    { value: String(centralBankCount), label: 'Central banks' },
  ]

  const eventRows = upcomingEvents.map((event) => ({
    day: formatDateValue(event.event_date_utc || event.event_date),
    dow: formatWeekday(event.event_date_utc || event.event_date),
    time: formatTime(event.event_date_utc || event.event_date),
    region: event.country_code ?? 'US',
    type: getEventType(event),
    title: event.event_name,
    detail: getEventDetail(event),
    impact: event.impact_level === 'high' ? 'High' : event.impact_level === 'low' ? 'Low' : 'Medium',
    href: `/events/${event.slug}`,
  }))

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
              <div className="flex flex-wrap gap-3"><Link href="#week" className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Explore the calendar<ArrowRight data-icon="inline-end" aria-hidden="true" /></Link><Button size="lg" variant="outline">Choose your regions</Button></div>
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-muted-foreground"><span className="flex items-center gap-1.5"><ShieldCheck aria-hidden="true" />Primary sources</span><span className="flex items-center gap-1.5"><CalendarCheck2 aria-hidden="true" />Daily verification</span><span className="flex items-center gap-1.5"><CheckCircle2 aria-hidden="true" />Plain-language context</span></div>
            </div>
            <div className="grid grid-cols-2 overflow-hidden rounded-xl border bg-background md:grid-cols-3">
              {statItems.map(({ value, label }) => (
                <div key={label} className="border-b border-r p-5 last:border-r-0 md:border-b-0 md:border-r first:rounded-bl-xl last:rounded-br-xl">
                  <p className="font-mono text-3xl font-semibold tracking-tight">{value}</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="week" className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
          <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">{`${monthName} 7–14, ${now.getUTCFullYear()}`}</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">This week&apos;s key events</h2>
              <p className="mt-2 text-muted-foreground">Times shown in Coordinated Universal Time (UTC).</p>
            </div>
          </div>
          <EventList events={eventRows} />
        </section>

        <section id="categories" className="border-y bg-secondary">
          <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
            <div className="mb-8 max-w-xl"><p className="text-xs font-semibold uppercase tracking-wider text-primary">Browse by topic</p><h2 className="mt-2 text-balance text-3xl font-semibold tracking-tight md:text-4xl">One calendar, every financial deadline</h2></div>
            <div className="grid gap-px overflow-hidden rounded-xl border bg-border md:grid-cols-2 lg:grid-cols-5">
              {categories.map(({ name, icon: Icon, copy, filter }) => {
                const count = homepageEvents.filter(filter).length
                const isDisabled = count === 0
                return (
                  <article key={name} className={`group flex min-h-56 flex-col justify-between bg-card p-5 ${isDisabled ? 'opacity-60' : 'hover:bg-background'}`}>
                    <div className="flex items-start justify-between">
                      <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground"><Icon aria-hidden="true" /></span>
                      {!isDisabled ? <ArrowRight aria-hidden="true" className="text-muted-foreground transition-transform group-hover:translate-x-1" /> : null}
                    </div>
                    <div>
                      <p className="font-semibold">{name}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{copy}</p>
                      <p className="mt-4 font-mono text-xs font-semibold uppercase tracking-wider text-primary">{count} {name.toLowerCase()}</p>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section id="methodology" className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:px-6 md:py-24 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">How Finvents works</p>
            <h2 className="mt-3 text-balance text-4xl font-semibold tracking-tight">Useful data starts with a reliable source.</h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">We prioritize official institutions, label uncertainty, and explain each event without jargon or prediction.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              [SearchCheck, '01', 'Collect', 'Dates are gathered from central banks, tax agencies, statistical offices, exchanges, and official project channels.'],
              [ShieldCheck, '02', 'Verify', 'Our team checks schedules against primary sources and records when each entry was last reviewed.'],
              [BarChart3, '03', 'Explain', 'We add neutral context, historical data, and practical impact without offering personalized advice.'],
            ].map(([Icon, num, title, copy]) => {
              const StepIcon = Icon as typeof SearchCheck
              return (
                <article key={String(num)} className="border-t-2 border-primary pt-5">
                  <div className="flex items-center justify-between">
                    <StepIcon aria-hidden="true" className="text-primary" />
                    <span className="font-mono text-xs text-muted-foreground">{String(num)}</span>
                  </div>
                  <h3 className="mt-8 text-xl font-semibold">{String(title)}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{String(copy)}</p>
                </article>
              )
            })}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
