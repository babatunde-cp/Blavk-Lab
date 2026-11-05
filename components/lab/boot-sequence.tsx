'use client'

import { useEffect, useEffectEvent, useState } from 'react'
import { cn } from '@/lib/utils'
import { TypedText } from './typed-text'

type BootLine = { text: string; className: string; speed: number; pause: number }

const BOOT_LINES: BootLine[] = [
  {
    text: 'BLAVK DATA LAB',
    className: 'block font-sans text-3xl font-semibold tracking-[0.18em] text-foreground sm:text-5xl',
    speed: 45,
    pause: 220,
  },
  { text: '[BOOT] Initializing BLAVK DATA LAB...', className: 'block text-lab-blue', speed: 9, pause: 120 },
  { text: '[INIT] Loading analytics and engineering modules...', className: 'block text-lab-purple', speed: 9, pause: 200 },
]

type BootSequenceProps = {
  instant: boolean
  onComplete: () => void
}

export function BootSequence({ instant, onComplete }: BootSequenceProps) {
  const [active, setActive] = useState(0)
  const [typed, setTyped] = useState(-1)
  const complete = useEffectEvent(onComplete)

  useEffect(() => {
    if (instant) {
      complete()
      return
    }
    if (typed < active) return
    if (active >= BOOT_LINES.length - 1) {
      const t = window.setTimeout(complete, BOOT_LINES[active].pause)
      return () => window.clearTimeout(t)
    }
    const t = window.setTimeout(() => setActive((a) => a + 1), BOOT_LINES[active].pause)
    return () => window.clearTimeout(t)
  }, [typed, active, instant])

  const visibleCount = instant ? BOOT_LINES.length : active + 1

  return (
    <div className="space-y-1.5 font-mono text-sm leading-relaxed">
      {BOOT_LINES.slice(0, visibleCount).map((line, i) => (
        <div key={line.text} className={cn(i === 0 && 'pb-4')}>
          {i === 0 ? (
            <h1>
              <TypedText
                text={line.text}
                speed={line.speed}
                instant={instant || i < active}
                onDone={() => setTyped((t) => Math.max(t, i))}
                className={line.className}
              />
            </h1>
          ) : (
            <TypedText
              text={line.text}
              speed={line.speed}
              instant={instant || i < active}
              onDone={() => setTyped((t) => Math.max(t, i))}
              className={line.className}
            />
          )}
        </div>
      ))}
    </div>
  )
}
