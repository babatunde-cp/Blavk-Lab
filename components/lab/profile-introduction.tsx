'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import { LabBackground } from '@/components/lab/lab-background'
import { SiteMenu } from '@/components/lab/site-menu'
import { ThemeToggle } from '@/components/lab/theme-toggle'
import { ToolkitSection } from '@/components/lab/toolkit-section'
import { DataFlowSection } from '@/components/lab/data-flow-section'
import { ContactSection } from '@/components/lab/contact-section'
import { ScrollMotion } from '@/components/lab/scroll-motion'
import { Download } from 'lucide-react'
import { profileQuery, profileRows, professionalProfile } from '@/lib/professional-profile'
import { ProjectArchive } from './project-archive'

const noopSubscribe = () => () => {}
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const profileRowTones = ['tone-sky', 'tone-violet', 'tone-teal', 'tone-amber', 'tone-rose']

type IntroPhase = 'typing' | 'query' | 'success' | 'editorExit' | 'heading' | 'loadingProfile' | 'profileVisible' | 'aboutVisible' | 'introComplete'

export function ProfileIntroduction() {
  const reducedMotion = useSyncExternalStore(
    (callback) => {
      const media = window.matchMedia('(prefers-reduced-motion: reduce)')
      media.addEventListener('change', callback)
      return () => media.removeEventListener('change', callback)
    },
    prefersReducedMotion,
    () => false,
  )
  const [phase, setPhase] = useState<IntroPhase>('typing')
  const [typedCount, setTypedCount] = useState(0)
  const [visibleRows, setVisibleRows] = useState(0)

  const skipIntro = useCallback(() => {
    setTypedCount(profileQuery.length)
    setVisibleRows(profileRows.length)
    setPhase('introComplete')
  }, [])

  useEffect(() => {
    const skipForMenuNavigation = () => skipIntro()
    window.addEventListener('blavk:skip-profile-intro', skipForMenuNavigation)
    if (window.location.hash) skipIntro()
    return () => window.removeEventListener('blavk:skip-profile-intro', skipForMenuNavigation)
  }, [skipIntro])

  useEffect(() => {
    if (phase !== 'introComplete' || !window.location.hash) return
    const targetId = window.location.hash.slice(1)
    const timeout = window.setTimeout(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' })
    }, 80)
    return () => window.clearTimeout(timeout)
  }, [phase, reducedMotion])

  useEffect(() => {
    if (phase !== 'typing') return
    if (reducedMotion) {
      setTypedCount(profileQuery.length)
      setPhase('query')
      return
    }
    let count = 0
    let finishTimeout: number | undefined
    const interval = window.setInterval(() => {
      count += 1
      setTypedCount(count)
      if (count >= profileQuery.length) {
        window.clearInterval(interval)
        finishTimeout = window.setTimeout(() => setPhase('query'), 160)
      }
    }, 8)
    return () => {
      window.clearInterval(interval)
      if (finishTimeout !== undefined) window.clearTimeout(finishTimeout)
    }
  }, [phase, reducedMotion])

  useEffect(() => {
    let timeout: number | undefined
    if (phase === 'query') timeout = window.setTimeout(() => setPhase('success'), 620)
    if (phase === 'success') timeout = window.setTimeout(() => setPhase('editorExit'), 430)
    if (phase === 'editorExit') timeout = window.setTimeout(() => setPhase('heading'), 300)
    if (phase === 'heading') timeout = window.setTimeout(() => setPhase('loadingProfile'), 120)
    if (phase === 'loadingProfile') timeout = window.setTimeout(() => setPhase('profileVisible'), 420)
    if (phase === 'aboutVisible') timeout = window.setTimeout(() => setPhase('introComplete'), 320)
    return () => {
      if (timeout !== undefined) window.clearTimeout(timeout)
    }
  }, [phase])

  useEffect(() => {
    if (phase !== 'profileVisible') return
    if (visibleRows >= profileRows.length) {
      if (reducedMotion) setPhase('aboutVisible')
      else {
        const timeout = window.setTimeout(() => setPhase('aboutVisible'), 250)
        return () => window.clearTimeout(timeout)
      }
      return
    }
    if (reducedMotion) {
      setVisibleRows(profileRows.length)
      return
    }
    const timeout = window.setTimeout(() => setVisibleRows((rows) => Math.min(rows + 1, profileRows.length)), 115)
    return () => window.clearTimeout(timeout)
  }, [phase, visibleRows, reducedMotion])

  const editorVisible = phase === 'typing' || phase === 'query' || phase === 'success' || phase === 'editorExit'
  const headingVisible = phase !== 'typing' && phase !== 'query' && phase !== 'success' && phase !== 'editorExit'
  const tableVisible = phase === 'profileVisible' || phase === 'aboutVisible' || phase === 'introComplete'
  const aboutVisible = phase === 'aboutVisible' || phase === 'introComplete'
  const displayedCode = profileQuery.slice(0, typedCount)

  return (
    <div className="relative isolate min-h-dvh">
      <ScrollMotion />
      <LabBackground stage={0} quiet />
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between gap-3 px-4">
          <Link href="/" className="font-mono text-xs tracking-[0.25em] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lab-cyan">
            BLAVK <span className="text-muted-foreground">// DATA LAB</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            {phase !== 'introComplete' && (
              <button
                type="button"
                onClick={skipIntro}
                className="rounded-md px-2.5 py-1.5 font-mono text-xs tracking-wider text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lab-cyan"
                aria-label="Skip profile introduction animation"
              >
                Skip intro <span aria-hidden="true">↗</span>
              </button>
            )}
            <ThemeToggle />
            <SiteMenu />
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-4xl flex-col px-4 pt-8 pb-20 sm:pt-12 sm:pb-24">
        <div className="lab-tone tone-sky mb-8 flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-muted-foreground">
          <span className="size-1.5 rounded-full bg-[color:var(--portfolio-tone)]" aria-hidden="true" />
          PROFESSIONAL PROFILE <span className="text-border">/</span> {professionalProfile.id}
        </div>

        {editorVisible && (
          <section
            aria-label="Profile query editor"
            className={`lab-tone tone-violet lab-tone-surface relative overflow-hidden rounded-lg border bg-card shadow-[0_16px_60px_-36px_var(--lab-blue)] transition-[max-height,opacity,transform,margin] duration-300 motion-reduce:transition-none ${phase === 'editorExit' ? 'mb-0 max-h-0 -translate-y-2 border-transparent opacity-0' : 'mb-10 max-h-[34rem] opacity-100'}`}
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="font-mono text-xs text-muted-foreground">profile_lookup.sql</span>
              <span className="lab-tone-label font-mono text-[10px] tracking-widest">READ ONLY</span>
            </div>
            <pre className="overflow-x-auto px-4 py-5 font-mono text-[11px] leading-6 text-foreground sm:px-6 sm:text-sm" aria-label="SQL query">
              <code>{displayedCode.split('\n').map((line, index) => (
                <span key={index} className={`block whitespace-pre ${line.trimStart().startsWith('--') ? 'text-lab-cyan' : 'text-foreground'}`}>{line || '\u00a0'}</span>
              ))}{phase === 'typing' && <span className="ml-0.5 inline-block h-4 w-1 animate-blink bg-lab-cyan align-middle motion-reduce:animate-none" aria-hidden="true" />}</code>
            </pre>
            {(phase === 'query' || phase === 'success') && (
              <div className="border-t border-border px-4 py-3 font-mono text-xs sm:px-6" role="status" aria-live="polite">
                <p className="text-sky-500 dark:text-sky-300">[QUERY] Retrieving profile data...</p>
                {phase === 'success' && <p className="mt-1 text-emerald-600 dark:text-emerald-300">[SUCCESS] Profile data retrieved ✓</p>}
              </div>
            )}
          </section>
        )}

        {headingVisible && (
          <section className="animate-fade-up motion-reduce:animate-none" aria-labelledby="profile-heading">
            <h1 id="profile-heading" className="text-balance font-sans text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Who&apos;s behind the data?
            </h1>
            {phase === 'loadingProfile' && (
              <p className="mt-3 font-mono text-sm tracking-[0.35em] text-lab-cyan" role="status" aria-label="Preparing profile">
                <span className="animate-status-pulse motion-reduce:animate-none">. . .</span>
              </p>
            )}
          </section>
        )}

        {tableVisible && (
          <section className="mt-8 animate-fade-up motion-reduce:animate-none" aria-label="Retrieved professional profile">
            <div className="lab-tone tone-teal lab-tone-surface relative overflow-hidden rounded-lg border bg-card/90">
              <div className="grid grid-cols-[minmax(7.5rem,0.8fr)_minmax(0,1.5fr)] gap-4 border-b border-border bg-muted/40 px-4 py-3 font-mono text-[10px] tracking-[0.13em] text-muted-foreground sm:px-6 sm:text-xs">
                <span>PROFILE FIELD</span><span>RETRIEVED VALUE</span>
              </div>
              <dl>
                {profileRows.slice(0, visibleRows).map(({ field, value }, index) => (
                  <div id={field === 'Core Tools' ? 'profile-tools' : undefined} key={field} className={`lab-tone ${profileRowTones[index % profileRowTones.length]} lab-tone-row grid scroll-mt-24 grid-cols-[minmax(7.5rem,0.8fr)_minmax(0,1.5fr)] gap-4 border-b border-border/80 px-4 py-4 last:border-b-0 animate-reveal motion-reduce:animate-none sm:px-6`} style={{ animationDelay: reducedMotion ? '0ms' : `${index * 25}ms` }}>
                    <dt className="lab-tone-label font-mono text-xs leading-5 sm:text-sm">{field}</dt>
                    <dd className="min-w-0 break-words text-sm leading-5 text-foreground sm:text-base">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        )}

        {aboutVisible && (
          <section id="about-me" data-scroll-reveal className="lab-tone tone-amber mt-12 scroll-mt-24 max-w-3xl animate-fade-up motion-reduce:animate-none sm:mt-16" aria-labelledby="about-heading">
            <h2 id="about-heading" className="lab-tone-label text-2xl font-semibold tracking-tight sm:text-3xl">Beyond the data.</h2>
            <div className="mt-4 text-pretty text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
              {professionalProfile.about.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <p className="lab-tone-section-rule mt-5 border-l-2 bg-[color-mix(in_oklch,var(--portfolio-tone)_7%,transparent)] px-4 py-3 font-mono text-[11px] leading-5 text-amber-700 dark:text-amber-200 sm:text-xs">
              Business questions. Analytical thinking. Data-driven solutions.
            </p>
          </section>
        )}

        {phase === 'introComplete' && (
          <div className="mt-6 animate-fade-up motion-reduce:animate-none">
            <a href="/Babatunde_Kareem_CV.pdf" download="Babatunde_Kareem_CV.pdf" aria-label="Download Babatunde Kareem's CV" title="LORE DROP" className="lab-tone tone-emerald lab-tone-link inline-flex min-h-11 items-center gap-3 rounded-lg border px-4 py-2.5 font-mono text-xs tracking-[0.12em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400">
              <span>LORE DROP</span>
              <Download aria-hidden="true" className="size-3.5" />
            </a>
          </div>
        )}

        {phase === 'introComplete' && (
          <>
            <ProjectArchive />
            <ToolkitSection />
            <DataFlowSection />
            <ContactSection />
            <footer className="border-t border-border/60 px-4 py-6 text-center font-mono text-[10px] tracking-[0.14em] text-muted-foreground sm:py-8" aria-label="Copyright">
              <p>© Babatunde Kareem</p>
            </footer>
          </>
        )}
      </main>
    </div>
  )
}
