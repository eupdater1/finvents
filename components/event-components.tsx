import Link from 'next/link'
import { ArrowRight, CalendarPlus, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface EventTableRow {
  day: string
  dow: string
  time: string
  region: string
  type: string
  title: string
  detail: string
  impact: string
  href: string
}

export function EventList({ events }: { events: EventTableRow[] }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="hidden grid-cols-[80px_90px_1fr_100px] border-b bg-secondary px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground md:grid">
        <span>Date</span><span>Time</span><span>Event</span><span>Impact</span>
      </div>
      {events.map((event) => (
        <Link key={event.title} href={event.href} className="group grid grid-cols-[52px_1fr_auto] items-center gap-3 border-b p-4 last:border-b-0 hover:bg-secondary md:grid-cols-[80px_90px_1fr_100px] md:px-5">
          <div><span className="block text-2xl font-semibold tabular-nums leading-none">{event.day}</span><span className="text-xs font-medium text-muted-foreground">{event.dow}</span></div>
          <div className="hidden text-sm tabular-nums md:block"><span className="block font-medium">{event.time}</span><span className="text-xs text-muted-foreground">UTC</span></div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground"><span className="rounded bg-accent px-1.5 py-0.5 font-semibold text-accent-foreground">{event.region}</span><span>{event.type}</span></div>
            <p className="mt-1 truncate font-semibold group-hover:text-primary">{event.title}</p>
            <p className="text-xs text-muted-foreground">{event.detail}</p>
          </div>
          <div className="flex items-center justify-end gap-2 text-xs font-medium"><span className={event.impact === 'High' ? 'size-2 rounded-full bg-primary' : 'size-2 rounded-full bg-accent'} /><span className="hidden md:inline">{event.impact}</span><ArrowRight aria-hidden="true" className="md:hidden" /></div>
        </Link>
      ))}
    </div>
  )
}

export function StaticCountdown() {
  return (
    <div className="grid grid-cols-4 gap-2" aria-label="Countdown: 2 days, 14 hours, 32 minutes, 8 seconds">
      {[['02','Days'],['14','Hours'],['32','Min'],['08','Sec']].map(([value,label]) => (
        <div key={label} className="rounded-lg border bg-secondary p-3 text-center"><span className="block font-mono text-xl font-semibold tabular-nums md:text-2xl">{value}</span><span className="text-xs text-muted-foreground">{label}</span></div>
      ))}
    </div>
  )
}

export function AddToCalendarButton() {
  return <Button size="lg"><CalendarPlus data-icon="inline-start" aria-hidden="true" />Add to calendar</Button>
}

export function HistoricalRateChart() {
  return (
    <div className="rounded-xl border bg-card p-4 md:p-6">
      <div className="flex items-start justify-between gap-4"><div><p className="font-semibold">Federal funds target rate</p><p className="text-sm text-muted-foreground">Upper bound · 2021–2026</p></div><div className="text-right"><p className="font-mono text-2xl font-semibold">4.50%</p><p className="text-xs text-muted-foreground">Current</p></div></div>
      <div className="mt-8 h-56 border-b border-l p-3">
        <svg viewBox="0 0 600 180" role="img" aria-label="Historical target rate line chart rising from near zero in 2021 to 5.5 percent in 2023, then declining to 4.5 percent in 2026" className="size-full overflow-visible">
          <polyline points="0,165 80,165 140,150 200,112 270,60 340,22 420,22 490,48 600,62" fill="none" stroke="currentColor" strokeWidth="3" className="text-primary" vectorEffect="non-scaling-stroke" />
          <line x1="0" y1="62" x2="600" y2="62" stroke="currentColor" strokeDasharray="5 5" className="text-border" />
          <circle cx="600" cy="62" r="5" fill="currentColor" className="text-primary" />
        </svg>
      </div>
      <div className="mt-3 flex justify-between font-mono text-xs text-muted-foreground"><span>2021</span><span>2022</span><span>2023</span><span>2024</span><span>2025</span><span>2026</span></div>
    </div>
  )
}

export function ComparisonTable() {
  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full min-w-xl text-left text-sm">
        <caption className="sr-only">Current and previous Federal Reserve decision figures</caption>
        <thead className="bg-secondary text-xs uppercase tracking-wider text-muted-foreground"><tr><th className="px-4 py-3">Measure</th><th className="px-4 py-3">Previous</th><th className="px-4 py-3">Consensus</th><th className="px-4 py-3">Actual</th></tr></thead>
        <tbody><tr className="border-t"><th className="px-4 py-4 font-medium">Target rate upper bound</th><td className="px-4 py-4 font-mono">4.50%</td><td className="px-4 py-4 font-mono">4.50%</td><td className="px-4 py-4 text-muted-foreground">Pending</td></tr><tr className="border-t"><th className="px-4 py-4 font-medium">Vote split</th><td className="px-4 py-4 font-mono">11–1</td><td className="px-4 py-4 text-muted-foreground">—</td><td className="px-4 py-4 text-muted-foreground">Pending</td></tr></tbody>
      </table>
    </div>
  )
}

export function SourceLink() {
  return <a href="https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-medium text-primary hover:underline">Federal Reserve — FOMC calendars and information<ExternalLink aria-hidden="true" /></a>
}
