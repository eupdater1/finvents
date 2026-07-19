import Link from 'next/link'
import { CalendarDays, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function SiteHeader() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-sans font-semibold tracking-tight" aria-label="Finvents home">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <CalendarDays aria-hidden="true" />
          </span>
          <span>Finvents</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex" aria-label="Primary navigation">
          <Link href="/#week" className="text-muted-foreground transition-colors hover:text-foreground">Calendar</Link>
          <Link href="/#categories" className="text-muted-foreground transition-colors hover:text-foreground">Categories</Link>
          <Link href="/about" className="text-muted-foreground transition-colors hover:text-foreground">About</Link>
          <Link href="/contact" className="text-muted-foreground transition-colors hover:text-foreground">Contact</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="hidden md:inline-flex">Subscribe to updates</Button>
          <Button size="icon" variant="ghost" className="md:hidden" aria-label="Open navigation">
            <Menu aria-hidden="true" />
          </Button>
        </div>
      </div>
    </header>
  )
}
