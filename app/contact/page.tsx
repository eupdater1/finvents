import { Mail, MessageSquareText, Send } from 'lucide-react'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-14 md:px-6 md:py-20">
        <section className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">Contact</p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Get in touch</h1>
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Use the details below for feedback, source suggestions, or general questions about the site.
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-2xl border bg-card p-8">
            <div className="flex items-center gap-3 text-sm font-semibold text-foreground">
              <Mail aria-hidden="true" className="size-5 text-primary" />
              Email
            </div>
            <p className="mt-3 text-lg font-medium">[Insert your contact email]</p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              [Optional: add a short note about response times or preferred topics.]
            </p>
            <div className="mt-8 flex items-center gap-3 text-sm font-semibold text-foreground">
              <MessageSquareText aria-hidden="true" className="size-5 text-primary" />
              Other contact options
            </div>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              [Optional: add a social handle, form link, or alternate contact method here.]
            </p>
          </div>

          <form className="rounded-2xl border bg-card p-8">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-medium">
                <span>Name</span>
                <input className="rounded-lg border bg-background px-3 py-2" placeholder="Your name" />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium">
                <span>Email</span>
                <input className="rounded-lg border bg-background px-3 py-2" placeholder="you@example.com" />
              </label>
            </div>
            <label className="mt-4 flex flex-col gap-2 text-sm font-medium">
              <span>Message</span>
              <textarea className="min-h-32 rounded-lg border bg-background px-3 py-2" placeholder="Tell us what you need help with." />
            </label>
            <button type="button" className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              <Send aria-hidden="true" className="size-4" />
              Send message
            </button>
            <p className="mt-4 text-sm text-muted-foreground">This form is a placeholder and can be connected to your preferred form service later.</p>
          </form>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
