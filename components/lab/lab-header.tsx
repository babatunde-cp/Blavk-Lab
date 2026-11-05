import { RotateCcw, SkipForward } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThemeToggle } from './theme-toggle'

export type LabStatus = 'booting' | 'awaiting' | 'running' | 'ready'

const STATUS: Record<LabStatus, { label: string; dot: string }> = {
  booting: { label: 'BOOTING', dot: 'bg-lab-blue' },
  awaiting: { label: 'AWAITING INPUT', dot: 'bg-lab-purple' },
  running: { label: 'PIPELINE RUNNING', dot: 'bg-lab-purple' },
  ready: { label: 'SYSTEM READY', dot: 'bg-lab-cyan' },
}

type LabHeaderProps = {
  status: LabStatus
  onSkip: () => void
  onReplay: () => void
}

const ghostButton =
  'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-mono text-xs tracking-wider text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lab-cyan'

export function LabHeader({ status, onSkip, onReplay }: LabHeaderProps) {
  const s = STATUS[status]
  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/60 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between gap-3 px-4">
        <p className="font-mono text-xs tracking-[0.25em] text-foreground">
          BLAVK <span className="text-muted-foreground">{'//'}</span>{' '}
          <span className="hidden text-muted-foreground sm:inline">DATA LAB</span>
        </p>
        <div className="flex items-center gap-2 sm:gap-4">
          <p className="flex items-center gap-2 font-mono text-[11px] tracking-widest text-muted-foreground" role="status">
            <span
              aria-hidden="true"
              className={cn('size-2 rounded-full', s.dot, status !== 'ready' && 'animate-status-pulse')}
            />
            {s.label}
          </p>
          {status === 'ready' ? (
            <button type="button" onClick={onReplay} className={ghostButton}>
              <RotateCcw className="size-3.5" aria-hidden="true" />
              Replay
            </button>
          ) : (
            <button type="button" onClick={onSkip} className={ghostButton}>
              Skip intro
              <SkipForward className="size-3.5" aria-hidden="true" />
            </button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
