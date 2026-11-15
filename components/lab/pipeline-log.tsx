'use client'

import { useEffect, useEffectEvent, useState } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatTimestamp } from '@/lib/visitor-profile'

type Tone = 'sky' | 'cyan' | 'violet' | 'teal' | 'indigo' | 'amber' | 'emerald'

export const PIPELINE_STEPS: { tag: string; message: string; tone: Tone }[] = [
  { tag: 'INIT', message: 'Initializing BLAVK DATA LAB', tone: 'sky' },
  { tag: 'INFO', message: 'Establishing visitor session...', tone: 'cyan' },
  { tag: 'INGEST', message: 'Collecting available client metadata...', tone: 'teal' },
  { tag: 'VALIDATE', message: 'Validating incoming metadata fields...', tone: 'emerald' },
  { tag: 'TRANSFORM', message: 'Normalizing device and display attributes...', tone: 'indigo' },
  { tag: 'MODEL', message: 'Structuring visitor data into a tabular schema...', tone: 'violet' },
  { tag: 'ANALYTICS', message: 'Generating visitor profile summary...', tone: 'amber' },
  { tag: 'LOAD', message: 'Loading processed records into the visitor interface...', tone: 'sky' },
  { tag: 'SUCCESS', message: 'Visitor data pipeline completed ✓', tone: 'emerald' },
]

const STEP_INTERVAL_MS = 620

const TONE_TEXT: Record<Tone, string> = {
  sky: 'text-sky-600 dark:text-sky-300',
  cyan: 'text-cyan-700 dark:text-cyan-300',
  violet: 'text-violet-700 dark:text-violet-300',
  teal: 'text-teal-700 dark:text-teal-300',
  indigo: 'text-indigo-700 dark:text-indigo-300',
  amber: 'text-amber-700 dark:text-amber-300',
  emerald: 'text-emerald-700 dark:text-emerald-300',
}
const TONE_DOT: Record<Tone, string> = {
  sky: 'bg-sky-500',
  cyan: 'bg-cyan-500',
  violet: 'bg-violet-500',
  teal: 'bg-teal-500',
  indigo: 'bg-indigo-500',
  amber: 'bg-amber-500',
  emerald: 'bg-emerald-500',
}

type PipelineLogProps = {
  instant: boolean
  onProgress: (completed: number) => void
  onComplete: () => void
}

export function PipelineLog({ instant, onProgress, onComplete }: PipelineLogProps) {
  const [timestamps, setTimestamps] = useState<string[]>([])
  const progress = useEffectEvent(onProgress)
  const complete = useEffectEvent(onComplete)
  const total = PIPELINE_STEPS.length

  useEffect(() => {
    if (instant) {
      setTimestamps((ts) => {
        if (ts.length >= total) return ts
        const now = new Date()
        return [...ts, ...Array.from({ length: total - ts.length }, () => formatTimestamp(now))]
      })
      return
    }
    if (timestamps.length >= total) return
    const t = window.setTimeout(
      () => setTimestamps((ts) => (ts.length >= total ? ts : [...ts, formatTimestamp()])),
      timestamps.length === 0 ? 250 : STEP_INTERVAL_MS,
    )
    return () => window.clearTimeout(t)
  }, [timestamps.length, instant, total])

  useEffect(() => {
    progress(timestamps.length)
    if (timestamps.length < total) return
    if (instant) {
      complete()
      return
    }
    const t = window.setTimeout(complete, 450)
    return () => window.clearTimeout(t)
  }, [timestamps.length, instant, total])

  const done = timestamps.length >= total

  return (
    <section aria-labelledby="pipeline-heading" className="relative mt-6 overflow-hidden rounded-md border border-border bg-background/60">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <h2 id="pipeline-heading" className="font-mono text-xs tracking-[0.2em] text-muted-foreground">
          PIPELINE · client_side_demo
        </h2>
        <span className={cn('font-mono text-xs', done ? 'text-emerald-700 dark:text-emerald-300' : 'text-violet-700 dark:text-violet-300')}>
          {done ? 'COMPLETED' : `RUNNING ${timestamps.length}/${total}`}
        </span>
      </div>

      {!done && (
        <div aria-hidden="true" className="absolute inset-x-0 top-[37px] h-px overflow-hidden bg-border">
          <div className="animate-flow h-px w-1/4 bg-gradient-to-r from-transparent via-lab-cyan to-transparent" />
        </div>
      )}

      <ol className="space-y-1.5 px-4 py-3 font-mono text-[12px] leading-relaxed sm:text-[13px]" aria-live="polite">
        {PIPELINE_STEPS.slice(0, timestamps.length).map((step, i) => (
          <li key={step.tag} className={cn('flex gap-2', !instant && 'animate-reveal')}>
            <span className={cn('mt-[0.45em] size-1.5 shrink-0 rounded-full', TONE_DOT[step.tone])} aria-hidden="true" />
            <span className="shrink-0 text-muted-foreground tabular-nums">[{timestamps[i]}]</span>
            <span className="min-w-0">
              <span className={cn('font-semibold', TONE_TEXT[step.tone])}>[{step.tag}]</span>{' '}
              <span className={step.tag === 'SUCCESS' ? 'text-lab-cyan' : 'text-foreground/90'}>
                {step.message.replace(' ✓', '')}
                {step.tag === 'SUCCESS' && (
                  <>
                    <Check className="ml-1.5 inline size-3.5 -translate-y-px" aria-hidden="true" />
                    <span className="sr-only">done</span>
                  </>
                )}
              </span>
            </span>
          </li>
        ))}
      </ol>


    </section>
  )
}
