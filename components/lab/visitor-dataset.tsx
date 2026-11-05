'use client'

import { useEffect, useEffectEvent, useState } from 'react'
import { cn } from '@/lib/utils'
import { formatLocalTime, formatViewport, type FieldSource, type ProfileField } from '@/lib/visitor-profile'

const ROW_INTERVAL_MS = 110

const SOURCE_STYLE: Record<FieldSource, { label: string; className: string }> = {
  detected: { label: 'detected', className: 'text-lab-cyan border-lab-cyan/30 bg-lab-cyan/5' },
  estimated: { label: 'estimated', className: 'text-lab-purple border-lab-purple/30 bg-lab-purple/5' },
  unavailable: { label: 'unavailable', className: 'text-muted-foreground border-border bg-muted/40' },
  'local-only': { label: 'local only', className: 'text-lab-blue border-lab-blue/30 bg-lab-blue/5' },
}

function useLiveValues() {
  const [localTime, setLocalTime] = useState<string | null>(null)
  const [viewport, setViewport] = useState<string | null>(null)

  useEffect(() => {
    const tick = () => setLocalTime(formatLocalTime())
    const id = window.setInterval(tick, 1000)
    const onResize = () => setViewport(formatViewport())
    window.addEventListener('resize', onResize)
    return () => {
      window.clearInterval(id)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return { localTime, viewport }
}

type VisitorDatasetProps = {
  name: string | null
  fields: ProfileField[]
  instant: boolean
  onRevealed: () => void
}

export function VisitorDataset({ name, fields, instant, onRevealed }: VisitorDatasetProps) {
  const [visible, setVisible] = useState(instant ? fields.length : 0)
  const revealed = useEffectEvent(onRevealed)
  const live = useLiveValues()

  useEffect(() => {
    if (instant || visible >= fields.length) {
      if (visible < fields.length) setVisible(fields.length)
      else revealed()
      return
    }
    const t = window.setTimeout(() => setVisible((v) => v + 1), ROW_INTERVAL_MS)
    return () => window.clearTimeout(t)
  }, [visible, instant, fields.length])

  const valueFor = (field: ProfileField) => {
    if (field.key === 'local_time' && live.localTime) return live.localTime
    if (field.key === 'viewport_size' && live.viewport) return live.viewport
    return field.value
  }

  return (
    <section
      aria-labelledby="dataset-heading"
      className={cn(
        'overflow-hidden rounded-lg border border-border bg-card shadow-[0_0_60px_-20px_var(--lab-blue)] backdrop-blur-md',
        !instant && 'animate-fade-up',
      )}
    >
      <header className="flex flex-wrap items-end justify-between gap-2 border-b border-border px-4 py-3 sm:px-5">
        <div>
          <h2 id="dataset-heading" className="font-mono text-sm font-semibold tracking-[0.25em] text-foreground">
            {`${(name?.trim() || 'Visitor').toUpperCase()} DATASET`}
          </h2>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            SELECT * FROM <span className="text-lab-cyan">visitor_profile</span> LIMIT 1;
          </p>
        </div>
        <span className="font-mono text-[11px] text-muted-foreground">
          {fields.length} columns · 1 row
        </span>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full font-mono text-[12px] sm:text-[13px]">
          <caption className="sr-only">
            Visitor profile built from information your browser exposes. Each value is marked as detected, estimated,
            unavailable or local only.
          </caption>
          <thead>
            <tr className="border-b border-border text-left text-[11px] tracking-widest text-muted-foreground">
              <th scope="col" className="px-4 py-2 font-medium sm:px-5">FIELD</th>
              <th scope="col" className="px-4 py-2 font-medium">VALUE</th>
              <th scope="col" className="hidden px-4 py-2 font-medium sm:table-cell sm:px-5">SOURCE</th>
            </tr>
          </thead>
          <tbody>
            {fields.slice(0, visible).map((field) => {
              const source = SOURCE_STYLE[field.source]
              return (
                <tr
                  key={field.key}
                  className={cn('border-b border-border/60 last:border-0 hover:bg-accent/40', !instant && 'animate-reveal')}
                >
                  <th scope="row" className="px-4 py-2 text-left align-top font-normal text-lab-blue sm:px-5">
                    {field.key}
                  </th>
                  <td className="px-4 py-2 align-top break-words text-foreground">
                    <span className="tabular-nums">{valueFor(field)}</span>
                    <span
                      className={cn(
                        'mt-1 block w-fit rounded border px-1.5 py-px text-[10px] tracking-wider sm:hidden',
                        source.className,
                      )}
                    >
                      {source.label}
                    </span>
                  </td>
                  <td className="hidden px-4 py-2 align-top sm:table-cell sm:px-5">
                    <span className={cn('rounded border px-1.5 py-0.5 text-[10px] tracking-wider', source.className)}>
                      {source.label}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {visible >= fields.length && (
        <dl className={cn('grid grid-cols-2 gap-px border-t border-border bg-border sm:grid-cols-4', !instant && 'animate-fade-up')}>
          {[
            ['RECORDS PROCESSED', '01', 'text-foreground'],
            ['DATA QUALITY', 'VALIDATED', 'text-lab-purple'],
            ['PIPELINE STATUS', 'SUCCESS', 'text-lab-cyan'],
            ['OUTPUT', 'visitor_profile', 'text-lab-blue'],
          ].map(([label, value, tone]) => (
            <div key={label} className="bg-background/80 px-4 py-3">
              <dt className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">{label}</dt>
              <dd className={cn('mt-1 font-mono text-sm font-semibold', tone)}>{value}</dd>
            </div>
          ))}
        </dl>
      )}

    </section>
  )
}
