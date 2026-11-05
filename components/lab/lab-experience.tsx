'use client'

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { collectVisitorProfile, storeSessionName, type ProfileField } from '@/lib/visitor-profile'
import { BootSequence } from './boot-sequence'
import { EnterLabCta } from './enter-lab-cta'
import { LabBackground } from './lab-background'
import { LabHeader, type LabStatus } from './lab-header'
import { NamePrompt } from './name-prompt'
import { PIPELINE_STEPS, PipelineLog } from './pipeline-log'
import { VisitorDataset } from './visitor-dataset'

type Phase = 'boot' | 'name' | 'pipeline' | 'dataset'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

function subscribeReducedMotion(callback: () => void) {
  const mql = window.matchMedia(REDUCED_MOTION_QUERY)
  mql.addEventListener('change', callback)
  return () => mql.removeEventListener('change', callback)
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  )
}

export function LabExperience() {
  const router = useRouter()
  const reducedMotion = usePrefersReducedMotion()

  const [runId, setRunId] = useState(0)
  const [phase, setPhase] = useState<Phase>('boot')
  const [name, setName] = useState<string | null>(null)
  const [profile, setProfile] = useState<ProfileField[] | null>(null)
  const [skipped, setSkipped] = useState(false)
  const [stage, setStage] = useState(0)
  const [datasetRevealed, setDatasetRevealed] = useState(false)
  const [exiting, setExiting] = useState(false)

  const endRef = useRef<HTMLDivElement>(null)
  const exitTimer = useRef<number | null>(null)

  const instant = skipped || reducedMotion

  useEffect(() => {
    return () => {
      if (exitTimer.current) window.clearTimeout(exitTimer.current)
    }
  }, [])

  useEffect(() => {
    if (phase === 'boot' || phase === 'name') return
    endRef.current?.scrollIntoView({ behavior: instant ? 'auto' : 'smooth', block: 'end' })
  }, [phase, stage, datasetRevealed, instant])

  const handleBootComplete = useCallback(() => {
    setPhase((p) => (p === 'boot' ? 'name' : p))
  }, [])

  const handleNameSubmit = useCallback((visitorName: string) => {
    setName(visitorName)
    setProfile(collectVisitorProfile())
    setPhase('pipeline')
  }, [])

  const handlePipelineComplete = useCallback(() => {
    setStage(PIPELINE_STEPS.length)
    setPhase((p) => (p === 'pipeline' ? 'dataset' : p))
  }, [])

  const handleSkip = useCallback(() => {
    setSkipped(true)
    setName((n) => n ?? 'Visitor')
    setProfile((p) => p ?? collectVisitorProfile())
    setStage(PIPELINE_STEPS.length)
    setPhase('dataset')
  }, [])

  const handleReplay = useCallback(() => {
    if (exitTimer.current) window.clearTimeout(exitTimer.current)
    setRunId((id) => id + 1)
    setPhase('boot')
    setName(null)
    setProfile(null)
    setSkipped(false)
    setStage(0)
    setDatasetRevealed(false)
    setExiting(false)
    window.scrollTo({ top: 0 })
  }, [])

  const handleEnter = useCallback(() => {
    if (exiting) return
    if (name) storeSessionName(name)
    setExiting(true)
    exitTimer.current = window.setTimeout(() => router.push('/lab'), instant ? 0 : 700)
  }, [exiting, instant, name, router])

  const status: LabStatus =
    phase === 'boot' ? 'booting' : phase === 'name' ? 'awaiting' : phase === 'pipeline' ? 'running' : 'ready'

  return (
    <div className="relative isolate min-h-dvh">
      <LabBackground stage={stage} />
      <LabHeader status={status} onSkip={handleSkip} onReplay={handleReplay} />

      <main
        key={runId}
        className={cn(
          'mx-auto flex max-w-4xl flex-col gap-8 px-4 pt-8 pb-16 transition-[opacity,transform,filter] duration-700 sm:pt-14',
          exiting && 'pointer-events-none scale-[0.98] opacity-0 blur-sm',
        )}
      >
        <section
          aria-label="Lab terminal"
          className="overflow-hidden rounded-lg border border-border bg-card shadow-[0_0_80px_-30px_var(--lab-purple)] backdrop-blur-md"
        >
          <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <span aria-hidden="true" className="size-2.5 rounded-full bg-lab-purple/70" />
            <span aria-hidden="true" className="size-2.5 rounded-full bg-lab-blue/70" />
            <span aria-hidden="true" className="size-2.5 rounded-full bg-lab-cyan/70" />
            <p className="ml-2 truncate font-mono text-[11px] text-muted-foreground">visitor@blavk-lab: ~/session</p>
          </div>

          <div className="p-5 sm:p-8">
            <BootSequence instant={instant} onComplete={handleBootComplete} />

            {phase === 'name' && <NamePrompt onSubmit={handleNameSubmit} />}

            {name && (phase === 'pipeline' || phase === 'dataset') && (
              <>
                <p className={cn('mt-6 font-sans text-xl text-foreground sm:text-2xl', !instant && 'animate-fade-up')}>
                  Hey, <span className="text-lab-cyan">{name}</span> 👋 Welcome to BLAVK DATA LAB.
                </p>
                <PipelineLog instant={instant} onProgress={setStage} onComplete={handlePipelineComplete} />
              </>
            )}
          </div>
        </section>

        {phase === 'dataset' && profile && (
          <VisitorDataset name={name} fields={profile} instant={instant} onRevealed={() => setDatasetRevealed(true)} />
        )}

        {phase === 'dataset' && datasetRevealed && (
          <EnterLabCta instant={instant} disabled={exiting} onEnter={handleEnter} />
        )}

        <div ref={endRef} aria-hidden="true" />
      </main>

      {exiting && (
        <div
          role="status"
          className="fixed inset-0 z-30 flex items-center justify-center bg-background/80 font-mono text-sm tracking-[0.3em] text-lab-cyan animate-in fade-in duration-500"
        >
          OPENING THE LAB...
        </div>
      )}
    </div>
  )
}
