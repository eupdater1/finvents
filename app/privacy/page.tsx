import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'

export default function PrivacyPolicyPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-14 md:px-6 md:py-20">
        <section className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">Privacy policy</p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Privacy policy</h1>
          <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">
            This site is committed to being transparent about the data it uses and the limited scope of its analytics practices.
          </p>
        </section>

        <section className="rounded-2xl border bg-card p-8">
          <h2 className="text-2xl font-semibold tracking-tight">What information is collected</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            At present, the site does not collect personal data beyond standard site analytics that may be used to understand general traffic patterns and improve the experience. If an advertising network or other third-party service is introduced later, this policy will be updated accordingly.
          </p>
        </section>

        <section className="rounded-2xl border bg-card p-8">
          <h2 className="text-2xl font-semibold tracking-tight">Cookies and analytics</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            The site may use basic cookies or analytics tools that help measure page views, visitor numbers, and general site performance. These tools are used for aggregate reporting and are not intended to collect sensitive personal information.
          </p>
        </section>

        <section className="rounded-2xl border bg-card p-8">
          <h2 className="text-2xl font-semibold tracking-tight">Data use and retention</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Any analytics information collected is used only to improve the site’s functionality, content, and overall experience. Data retention periods depend on the analytics provider and the site’s hosting setup, and those practices may be updated if the service changes.
          </p>
        </section>

        <section className="rounded-2xl border bg-card p-8">
          <h2 className="text-2xl font-semibold tracking-tight">Third parties</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            The site may link to official sources and other public resources. These third-party sites operate under their own privacy and data practices, and this policy does not govern them.
          </p>
        </section>

        <section className="rounded-2xl border bg-card p-8">
          <h2 className="text-2xl font-semibold tracking-tight">Changes to this policy</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            This privacy policy may be updated when the site’s analytics setup, hosting setup, or third-party integrations change. Please revisit this page periodically for the latest information.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
