import Link from 'next/link'
import { ArrowRight, BadgeCheck, Mail, ShieldCheck } from 'lucide-react'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-14 md:px-6 md:py-20">
        <section className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">About this site</p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">A clear home for verified finance event dates</h1>
          <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">
            Finvents tracks official financial event dates and explains their market relevance in plain language. We focus on confirmed policy decisions, release dates, and deadlines so users can stay informed without the noise.
          </p>
        </section>

        <section className="grid gap-6 rounded-2xl border bg-card p-8 md:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Who runs the site</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">Independent finance event tracking</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Finvents is built as a straightforward reference for event dates that matter to investors, households, and policy watchers. We compile official schedules from government agencies, central banks, and statistical offices rather than relying on rumor or commentary.
            </p>
          </div>
          <div className="rounded-xl border bg-secondary p-6">
            <div className="flex items-center gap-3 text-sm font-medium text-foreground">
              <BadgeCheck className="size-5 text-primary" aria-hidden="true" />
              <span>Verified sourcing</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Dates are drawn from primary institutions such as the Federal Reserve, Bureau of Labor Statistics, IRS, and Bureau of Economic Analysis, with clear sourcing and last-verified dates for each event.
            </p>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border bg-card p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Why it exists</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">A practical reference for event timing</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Many financial calendars mix predictions, commentary, and headlines. Finvents aims to keep the focus on the exact dates and how they matter so readers can plan around central bank meetings, tax deadlines, and major economic releases.
            </p>
          </article>
          <article className="rounded-2xl border bg-card p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Sourcing and verification</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">How dates and figures are checked</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Each entry is based on primary source schedules and official announcements. We mark the source, last verification date, and whether the event is confirmed, drafted, or estimated to keep the status transparent.
            </p>
          </article>
        </section>

        <section className="rounded-2xl border bg-secondary p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Contact information</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">Questions, feedback, or source suggestions</h2>
            </div>
            <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
              Go to contact page <ArrowRight aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 rounded-full border bg-background px-4 py-2">
              <Mail aria-hidden="true" className="size-4" />
              <span>contact@finvents.vercel.app</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border bg-background px-4 py-2">
              <ShieldCheck aria-hidden="true" className="size-4" />
              <span>Preferred inquiries: sources, corrections, and event requests.</span>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
