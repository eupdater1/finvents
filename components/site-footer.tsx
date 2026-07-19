import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="border-t bg-secondary">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 md:flex-row md:items-end md:justify-between md:px-6">
        <div className="flex max-w-md flex-col gap-2">
          <p className="font-semibold">Finvents</p>
          <p className="text-sm leading-relaxed text-muted-foreground">Global financial dates, explained clearly. Information is for educational purposes and is not financial, tax, or investment advice.</p>
        </div>
        <nav className="flex flex-wrap gap-6 text-sm font-medium" aria-label="Footer navigation">
          <Link href="/about">About</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/disclaimer">Disclaimer</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </div>
      <div className="border-t px-4 py-4 text-center text-xs text-muted-foreground">© 2026 Finvents. Dates and figures are verified against primary sources.</div>
    </footer>
  )
}
