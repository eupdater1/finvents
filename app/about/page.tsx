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
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">A clear home for finance event information</h1>
          <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">
            This page is a placeholder structure for your story, mission, and editorial approach. Replace the bracketed text below with your own voice and details.
          </p>
        </section>

        <section className="grid gap-6 rounded-2xl border bg-card p-8 md:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Who runs the site</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">Who is behind this calendar?</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              [Insert a short introduction about the people, organization, or editorial team behind the site. Do not add biographical details that you have not confirmed.]
            </p>
          </div>
          <div className="rounded-xl border bg-secondary p-6">
            <div className="flex items-center gap-3 text-sm font-medium text-foreground">
              <BadgeCheck className="size-5 text-primary" aria-hidden="true" />
              <span>Editorial placeholder</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              [Add a note about the site’s mission, ownership model, or publishing approach here.]
            </p>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border bg-card p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Why it exists</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">Why this resource was created</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              [Explain the problem this site solves, the audience it serves, and the value of presenting finance events in plain language.]
            </p>
          </article>
          <article className="rounded-2xl border bg-card p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Sourcing and verification</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">How dates and figures are checked</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              [Describe your process for reviewing official sources, updating content, and flagging time-sensitive information.]
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
              <span>[Insert your contact email]</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border bg-background px-4 py-2">
              <ShieldCheck aria-hidden="true" className="size-4" />
              <span>[Insert any preferred contact note]</span>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
