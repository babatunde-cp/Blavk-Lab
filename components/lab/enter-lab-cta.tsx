import { cn } from '@/lib/utils'

type EnterLabCtaProps = {
  instant: boolean
  disabled: boolean
  onEnter: () => void
}

export function EnterLabCta({ instant, disabled, onEnter }: EnterLabCtaProps) {
  return (
    <div className={cn('relative z-10 flex flex-col items-center gap-6 py-10 text-center', !instant && 'animate-fade-up')}>
      <div className="flex flex-col items-center gap-2">
        <p className="rounded-md bg-background/95 px-3 py-1 font-sans text-xs italic text-red-600/90 dark:text-red-400/90 sm:text-sm">
          Hollup, before you arrest me for invading 🙌🏼.
        </p>
        <p className="font-sans text-lg text-foreground sm:text-xl">Check out my data</p>
      </div>
      <button
        type="button"
        onClick={onEnter}
        disabled={disabled}
        className="group relative inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-lab-blue via-lab-purple to-lab-cyan p-px font-mono text-sm font-semibold tracking-[0.2em] shadow-[0_0_40px_-10px_var(--lab-cyan)] transition-shadow hover:shadow-[0_0_55px_-8px_var(--lab-cyan)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lab-cyan focus-visible:ring-offset-4 focus-visible:ring-offset-background disabled:opacity-60"
      >
        <span className="rounded-[7px] bg-background/90 px-8 py-4 text-foreground transition-colors group-hover:bg-background/70">
          ENTER THE LAB
        </span>
      </button>
    </div>
  )
}
