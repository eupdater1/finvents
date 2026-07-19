'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowDownRight, ArrowUpRight, BadgeCheck, Clock3, ExternalLink, Globe2, Minus, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react'
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

export interface EventDetailData {
  event_name: string
  event_code?: string
  event_type?: string
  country?: string
  location?: string
  event_date_utc?: string
  description?: string
  description_long?: string
  impact_level?: 'High' | 'Medium' | 'Low'
  impact_layers?: Array<{
    title: string
    direction: 'higher' | 'lower' | 'in-line'
    summary: string
  }>
  life_categories?: string[]
  historical_data?: Record<string, Array<{ label: string; value: number }>>
  related_events?: Array<{ title: string; url: string }>
  faqs?: Array<{ question: string; answer: string }>
  source_name?: string
  source_url?: string
  last_verified?: string
  recap_published?: boolean
  actual_value?: string
  actual_value_status?: string
  recap_summary?: string
}

interface EventDetailPageProps {
  data: EventDetailData
  slug?: string
}

const impactStyles: Record<string, { badge: string; classes: string; icon: typeof TrendingUp }> = {
  High: { badge: 'High impact', classes: 'border-red-200 bg-red-50 text-red-700', icon: TrendingUp },
  Medium: { badge: 'Medium impact', classes: 'border-amber-200 bg-amber-50 text-amber-700', icon: TrendingUp },
  Low: { badge: 'Low impact', classes: 'border-emerald-200 bg-emerald-50 text-emerald-700', icon: TrendingUp },
}

const directionStyles: Record<string, { label: string; icon: typeof ArrowUpRight; classes: string }> = {
  higher: { label: 'Higher than expected', icon: ArrowUpRight, classes: 'border-red-200 bg-red-50 text-red-700' },
  lower: { label: 'Lower than expected', icon: ArrowDownRight, classes: 'border-amber-200 bg-amber-50 text-amber-700' },
  'in-line': { label: 'In line with expectations', icon: Minus, classes: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
}

function getCountdownParts(targetDate: Date) {
  const diff = targetDate.getTime() - Date.now()

  if (diff <= 0) {
    return { days: '00', hours: '00', minutes: '00', seconds: '00', isComplete: true }
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)

  return {
    days: String(days).padStart(2, '0'),
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
    isComplete: false,
  }
}

function toDisplayDate(value?: string) {
  if (!value) {
    return ''
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return value
  }

  return parsed.toLocaleString('en', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  })
}

function formatInitialDate() {
  return 'Loading event time…'
}

export default function EventDetailPage({ data, slug = 'events' }: EventDetailPageProps) {
  const [mounted, setMounted] = useState(false)
  const [countdown, setCountdown] = useState<ReturnType<typeof getCountdownParts> | null>(null)
  const [displayDate, setDisplayDate] = useState(() => formatInitialDate())
  const [range, setRange] = useState<'1yr' | '5yr' | '10yr'>('5yr')

  useEffect(() => {
    setMounted(true)
    setDisplayDate(data.event_date_utc ? toDisplayDate(data.event_date_utc) : '')

    if (!data.event_date_utc) {
      return
    }

    setCountdown(getCountdownParts(new Date(data.event_date_utc)))

    const timer = window.setInterval(() => {
      setCountdown(getCountdownParts(new Date(data.event_date_utc!)))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [data.event_date_utc])

  const chartSeries = data.historical_data?.[range] ?? []

  const chartData = useMemo(() => ({
    labels: chartSeries.map((point) => point.label),
    datasets: [
      {
        label: 'Value',
        data: chartSeries.map((point) => point.value),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.16)',
        fill: true,
        tension: 0.3,
        pointRadius: 3,
      },
    ],
  }), [chartSeries])

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      y: {
        ticks: {
          callback: (value: string | number) => `${value}%`,
        },
      },
    },
  }), [])

  const impactStyle = data.impact_level ? impactStyles[data.impact_level] : undefined
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'FAQPage',
        mainEntity: (data.faqs ?? []).map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
      {
        '@type': 'Organization',
        name: data.source_name ?? 'Finance Events',
        url: data.source_url ?? '/',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
          { '@type': 'ListItem', position: 2, name: data.event_name, item: `/${slug}` },
        ],
      },
      {
        '@type': 'SpeakableSpecification',
        cssSelector: ['h1', '[data-speakable]'],
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <SiteHeader />
      <main>
        <section className="border-b bg-secondary/70">
          <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-14">
            <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
              <ArrowLeft aria-hidden="true" />
              Back to calendar
            </Link>

            <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
              <div className="flex flex-col gap-5">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                  {impactStyle ? <span className={`rounded px-2 py-1 ${impactStyle.classes}`}>{impactStyle.badge}</span> : null}
                  {data.event_type ? <span className="rounded border px-2 py-1">{data.event_type}</span> : null}
                  {data.country ? <span className="rounded border px-2 py-1">{data.country}</span> : null}
                </div>

                <div>
                  {data.event_code ? <p className="mb-3 font-mono text-sm text-muted-foreground">{data.event_code}</p> : null}
                  <h1 className="max-w-4xl text-balance text-4xl font-semibold tracking-tight md:text-6xl">{data.event_name}</h1>
                  {data.description ? <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">{data.description}</p> : null}
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                  {data.event_date_utc ? (
                    <span className="flex items-center gap-2">
                      <Clock3 aria-hidden="true" />
                      {mounted ? displayDate : formatInitialDate()}
                    </span>
                  ) : null}
                  {data.location ? (
                    <span className="flex items-center gap-2">
                      <Globe2 aria-hidden="true" />
                      {data.location}
                    </span>
                  ) : null}
                  {data.source_name ? (
                    <span className="flex items-center gap-2">
                      <ShieldCheck aria-hidden="true" />
                      Verified source
                    </span>
                  ) : null}
                </div>
              </div>

              {data.event_date_utc ? (
                <div className="flex flex-col gap-4 rounded-xl border bg-background p-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Event begins in</p>
                    <p className="mt-1 text-sm">{countdown?.isComplete ? 'The event has already occurred.' : 'Live countdown to the announcement.'}</p>
                  </div>
                  {mounted && countdown ? (
                    <div className="grid grid-cols-4 gap-2" aria-label="Countdown timer">
                      {[
                        ['Days', countdown.days],
                        ['Hours', countdown.hours],
                        ['Min', countdown.minutes],
                        ['Sec', countdown.seconds],
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-lg border bg-secondary p-3 text-center">
                          <span className="block font-mono text-xl font-semibold tabular-nums md:text-2xl">{value}</span>
                          <span className="text-xs text-muted-foreground">{label}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-2" aria-label="Countdown timer placeholder">
                      {['Days', 'Hours', 'Min', 'Sec'].map((label) => (
                        <div key={label} className="rounded-lg border bg-secondary p-3 text-center">
                          <span className="block font-mono text-xl font-semibold tabular-nums md:text-2xl">--</span>
                          <span className="text-xs text-muted-foreground">{label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <div className="mx-auto flex max-w-7xl flex-col gap-16 px-4 py-12 md:px-6 md:py-20">
          {data.description_long ? (
            <section className="grid gap-8 lg:grid-cols-[1fr_280px]">
              <div className="flex flex-col gap-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">Plain-language briefing</p>
                <h2 className="text-balance text-3xl font-semibold tracking-tight">What this means</h2>
                <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">{data.description_long}</p>
              </div>
              {impactStyle ? (
                <aside className="rounded-xl border bg-secondary p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Impact level</p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className={`rounded-full border p-2 ${impactStyle.classes}`}>
                      <BadgeCheck aria-hidden="true" className="size-5" />
                    </div>
                    <div>
                      <p className="font-semibold">{data.impact_level}</p>
                      <p className="text-sm text-muted-foreground">Manual severity signal</p>
                    </div>
                  </div>
                </aside>
              ) : null}
            </section>
          ) : null}

          {data.impact_level ? (
            <section className="flex flex-col gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">Impact severity</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight">How strongly it can move markets</h2>
              </div>
              <div className="rounded-xl border bg-card p-6 md:p-8">
                <div className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${impactStyle?.classes}`}>
                  <Sparkles aria-hidden="true" className="mr-2 size-4" />
                  {impactStyle?.badge}
                </div>
                <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                  This event is marked with a {data.impact_level.toLowerCase()} severity level because it can influence rates, sentiment, and household finances at the same time.
                </p>
              </div>
            </section>
          ) : null}

          {data.impact_layers && data.impact_layers.length > 0 ? (
            <section className="flex flex-col gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">Impact layer</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight">If the outcome is higher, lower, or in line</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {data.impact_layers.map((layer) => {
                  const direction = directionStyles[layer.direction]
                  const Icon = direction.icon
                  return (
                    <article key={layer.title} className={`rounded-xl border p-6 ${direction.classes}`}>
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-semibold">{layer.title}</h3>
                        <Icon aria-hidden="true" className="size-5" />
                      </div>
                      <p className="mt-3 text-sm font-medium">{direction.label}</p>
                      <p className="mt-2 text-sm leading-relaxed opacity-90">{layer.summary}</p>
                    </article>
                  )
                })}
              </div>
            </section>
          ) : null}

          {data.life_categories && data.life_categories.length > 0 ? (
            <section className="flex flex-col gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">Who feels it</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight">Life-category impact</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {data.life_categories.map((category) => (
                  <span key={category} className="rounded-full border bg-card px-3 py-2 text-sm font-medium">
                    {category}
                  </span>
                ))}
              </div>
            </section>
          ) : null}

          {chartSeries.length > 0 ? (
            <section className="flex flex-col gap-6">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">Historical context</p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight">Past moves over time</h2>
                </div>
                <div className="inline-flex rounded-full border bg-card p-1">
                  {(['1yr', '5yr', '10yr'] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setRange(option)}
                      className={`rounded-full px-3 py-1.5 text-sm font-medium ${range === option ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border bg-card p-4 md:p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">Historical values</p>
                    <p className="text-sm text-muted-foreground">{range} view of the recent sequence</p>
                  </div>
                  <div className="rounded-full bg-secondary px-3 py-1 text-sm text-muted-foreground">{range}</div>
                </div>
                <div className="h-72">
                  <Line data={chartData} options={chartOptions} />
                </div>
              </div>
            </section>
          ) : null}

          {data.related_events && data.related_events.length > 0 ? (
            <section className="flex flex-col gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">Related events</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight">Find the surrounding story</h2>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {data.related_events.map((item) => (
                  <a key={item.url} href={item.url} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-xl border bg-card p-4 text-sm font-medium text-foreground hover:border-primary">
                    <span>{item.title}</span>
                    <ExternalLink aria-hidden="true" className="size-4 text-muted-foreground" />
                  </a>
                ))}
              </div>
            </section>
          ) : null}

          {data.faqs && data.faqs.length > 0 ? (
            <section className="flex flex-col gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">Frequent questions</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight">Answers you can read quickly</h2>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                {data.faqs.map((item) => (
                  <article key={item.question} className="rounded-xl border bg-card p-6">
                    <h3 className="font-semibold">{item.question}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {(data.source_name || data.source_url || data.last_verified) ? (
            <section className="rounded-xl border bg-secondary p-6 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Source citation</p>
              {data.source_name && data.source_url ? (
                <a href={data.source_url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 font-medium text-primary hover:underline">
                  {data.source_name}
                  <ExternalLink aria-hidden="true" />
                </a>
              ) : data.source_name ? <p className="mt-3 font-medium">{data.source_name}</p> : null}
              {data.last_verified ? <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Last verified {data.last_verified}.</p> : null}
            </section>
          ) : null}

          {data.recap_published ? (
            <section className="rounded-xl border bg-card p-6 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">Recap</p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight">What happened</h2>
                </div>
                <div className="rounded-full border bg-secondary px-3 py-1 text-sm font-medium">
                  {data.actual_value_status ?? 'Published'}
                </div>
              </div>
              <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_220px]">
                <div className="space-y-4">
                  {data.actual_value ? <p className="text-2xl font-semibold">{data.actual_value}</p> : null}
                  {data.recap_summary ? <p className="text-sm leading-relaxed text-muted-foreground">{data.recap_summary}</p> : null}
                </div>
                <div className="rounded-xl border bg-secondary p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</p>
                  <p className="mt-2 font-semibold">{data.actual_value_status ?? 'Confirmed'}</p>
                </div>
              </div>
            </section>
          ) : null}
        </div>
      </main>
      <SiteFooter />
    </>
  )
}

function SiteHeader() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <Link href="/" className="text-sm font-semibold tracking-tight">Finvents</Link>
        <nav className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Calendar</Link>
          <Link href="/events/fed-rate-decision" className="hover:text-foreground">Event</Link>
        </nav>
      </div>
    </header>
  )
}

function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-muted-foreground md:px-6">
        Finvents keeps public finance events clear, plain, and easy to follow.
      </div>
    </footer>
  )
}
