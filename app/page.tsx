import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, BarChart3, Terminal } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Welcome — Babatunde Kareem',
  description: 'Choose Classic Mode for an easy portfolio tour or Deep Dive to explore the interactive data lab.',
}

const modes = [
  {
    label: 'CLASSIC MODE',
    description: 'Browse my projects and experience in a clear, straightforward portfolio.',
    href: '/classic.html',
    icon: BarChart3,
    tone: 'border-lab-cyan/30 from-lab-cyan/10 via-card/90 to-sky-950/50',
    accent: 'text-lab-cyan',
  },
  {
    label: 'DEEP DIVE',
    description: 'Enter the interactive lab, meet the data, and explore the technical details.',
    href: '/deep-dive',
    icon: Terminal,
    tone: 'border-lab-purple/30 from-lab-purple/10 via-card/90 to-indigo-950/50',
    accent: 'text-lab-purple',
  },
]

export default function Page() {
  return (
    <main className="relative isolate flex min-h-dvh items-center overflow-hidden bg-background px-5 py-16 text-foreground sm:px-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_18%_18%,oklch(0.6_0.14_205_/_0.14),transparent_42%),radial-gradient(ellipse_at_82%_82%,oklch(0.5_0.16_285_/_0.12),transparent_45%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 opacity-[0.16] [background-image:linear-gradient(to_right,oklch(0.6_0.04_250_/_0.2)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.6_0.04_250_/_0.2)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-12 text-center sm:mb-14">
          <p className="font-mono text-[10px] tracking-[0.28em] text-lab-cyan sm:text-xs">BABATUNDE KAREEM <span className="text-muted-foreground">/ PORTFOLIO</span></p>
          <h1 className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-5xl">Welcome to my portfolio.</h1>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
            Pick the experience that suits you. You can explore my work in a few clicks or take a closer look inside the data lab.
          </p>
        </header>

        <nav aria-label="Choose a portfolio experience" className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          {modes.map(({ label, description, href, icon: Icon, tone, accent }, index) => (
            <Link
              key={label}
              href={href}
              className={['group flex min-h-64 flex-col rounded-2xl border bg-gradient-to-br p-6 shadow-lg transition duration-200 hover:-translate-y-1 hover:border-current/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lab-cyan focus-visible:ring-offset-4 focus-visible:ring-offset-background sm:p-8', tone].join(' ')}
            >
              <div className="flex items-center justify-between">
                <span className={['font-mono text-[10px] tracking-[0.2em]', accent].join(' ')}>0{index + 1} <span className="text-muted-foreground">/ EXPLORE</span></span>
                <Icon aria-hidden="true" className={['size-5', accent].join(' ')} />
              </div>
              <div className="mt-auto pt-10">
                <h2 className="text-2xl font-semibold tracking-wide sm:text-3xl">{label}</h2>
                <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground sm:text-base">{description}</p>
                <span className={['mt-6 inline-flex items-center gap-2 font-mono text-xs tracking-[0.14em]', accent].join(' ')}>
                  {label === 'CLASSIC MODE' ? 'BROWSE THE PORTFOLIO' : 'ENTER THE LAB'}
                  <ArrowUpRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </nav>
      </div>
    </main>
  )
}
