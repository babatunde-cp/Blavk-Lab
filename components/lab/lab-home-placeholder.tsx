'use client'

import Link from 'next/link'
import { useSyncExternalStore } from 'react'
import { readSessionName } from '@/lib/visitor-profile'
import { LabBackground } from './lab-background'
import { ThemeToggle } from './theme-toggle'

const noopSubscribe = () => () => {}

export function LabHomePlaceholder() {
  const name = useSyncExternalStore(noopSubscribe, readSessionName, () => null)

  return (
    <div className="relative isolate min-h-dvh">
      <LabBackground stage={9} />
      <ThemeToggle className="fixed top-3 right-4 z-20" />
      <main className="animate-fade-up mx-auto flex min-h-dvh max-w-2xl flex-col items-center justify-center gap-6 px-4 text-center">
        <p className="font-mono text-xs tracking-[0.3em] text-lab-cyan">SESSION ACTIVE</p>
        <h1 className="font-sans text-3xl font-semibold tracking-[0.12em] text-balance text-foreground sm:text-5xl">
          {name ? `Welcome in, ${name}.` : 'Welcome to the lab.'}
        </h1>
        <div className="w-full rounded-lg border border-dashed border-lab-purple/50 bg-card px-6 py-8 backdrop-blur-md">
          <p className="font-mono text-xs tracking-[0.25em] text-lab-purple">PLACEHOLDER · MAIN PORTFOLIO</p>
          <p className="mt-3 text-muted-foreground text-pretty">
            The main BLAVK DATA LAB portfolio homepage will live here. Projects, case studies and contact details
            are coming soon.
          </p>
        </div>
        <Link
          href="/"
          className="rounded-md px-3 py-2 font-mono text-xs tracking-widest text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lab-cyan"
        >
          ← Replay the intro
        </Link>
      </main>
    </div>
  )
}
