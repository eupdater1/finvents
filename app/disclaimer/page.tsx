import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'

export default function DisclaimerPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-14 md:px-6 md:py-20">
        <section className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">Disclaimer</p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Disclaimer</h1>
          <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">
            The information on this website is provided for educational and informational purposes only.
          </p>
        </section>

        <section className="rounded-2xl border bg-card p-8">
          <h2 className="text-2xl font-semibold tracking-tight">Not financial advice</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Nothing on this site should be interpreted as financial, tax, legal, or investment advice. Decisions involving borrowing, investing, taxes, or other financial matters should be made only after independent review of your own circumstances.
          </p>
        </section>

        <section className="rounded-2xl border bg-card p-8">
          <h2 className="text-2xl font-semibold tracking-tight">Official sources and verification</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            The site tracks dates, figures, and event details from official sources where possible and labels uncertainty where appropriate. Readers should still verify time-sensitive figures directly with the cited source before making decisions, especially when deadlines, scheduled announcements, or release times may change.
          </p>
        </section>

        <section className="rounded-2xl border bg-card p-8">
          <h2 className="text-2xl font-semibold tracking-tight">Accuracy and timing</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Event schedules and published data can change without notice. Please confirm the latest information from the original source before relying on it for planning or decision-making.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
