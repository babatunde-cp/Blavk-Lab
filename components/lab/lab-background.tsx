import Image from 'next/image'
import { cn } from '@/lib/utils'

type LabBackgroundProps = {
  /** Number of pipeline stages completed (0–9). Drives node activation. */
  stage: number
  quiet?: boolean
}

const SOURCES = [
  { x: 140, y: 190, label: 'client.meta' },
  { x: 110, y: 410, label: 'display.attr' },
  { x: 150, y: 630, label: 'locale.ctx' },
]
const TRANSFORMS = [
  { x: 600, y: 300, label: 'normalize' },
  { x: 620, y: 520, label: 'model' },
]
const OUTPUT = { x: 1060, y: 410, label: 'visitor_profile' }

const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  left: `${(i * 37 + 11) % 100}%`,
  top: `${(i * 53 + 7) % 100}%`,
  delay: `${(i % 7) * -1.3}s`,
  size: i % 3 === 0 ? 3 : 2,
}))

function curve(x1: number, y1: number, x2: number, y2: number) {
  const mx = (x1 + x2) / 2
  return `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`
}

export function LabBackground({ stage, quiet = false }: LabBackgroundProps) {
  const ingestActive = stage >= 3
  const transformActive = stage >= 5
  const outputActive = stage >= 8

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      <Image
        src="/images/lab-collage.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className={cn(`scale-110 object-cover blur-[3px]`, quiet ? `opacity-[0.035] dark:opacity-[0.08]` : `opacity-15 dark:opacity-40`)}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_10%,oklch(0.68_0.19_255/0.18),transparent_55%),radial-gradient(ellipse_at_85%_80%,oklch(0.66_0.24_300/0.16),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,color-mix(in_oklch,var(--background)_92%,transparent)_85%)]" />
      <div className="lab-grid absolute inset-0" />

      {!quiet && (
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 820"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="lab-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {SOURCES.flatMap((s) =>
          TRANSFORMS.map((t) => (
            <path
              key={`${s.label}-${t.label}`}
              d={curve(s.x, s.y, t.x, t.y)}
              fill="none"
              stroke="var(--lab-blue)"
              strokeWidth={1.2}
              strokeDasharray="6 10"
              className={cn(
                'transition-opacity duration-700',
                ingestActive ? 'animate-dash opacity-60' : 'opacity-15',
              )}
            />
          )),
        )}
        {TRANSFORMS.map((t) => (
          <path
            key={`${t.label}-out`}
            d={curve(t.x, t.y, OUTPUT.x, OUTPUT.y)}
            fill="none"
            stroke="var(--lab-purple)"
            strokeWidth={1.4}
            strokeDasharray="6 10"
            className={cn(
              'transition-opacity duration-700',
              transformActive ? 'animate-dash opacity-70' : 'opacity-10',
            )}
          />
        ))}

        {SOURCES.map((s) => (
          <g key={s.label} className="transition-opacity duration-700" opacity={ingestActive ? 1 : 0.35}>
            <circle
              cx={s.x}
              cy={s.y}
              r={7}
              fill="var(--lab-blue)"
              filter={ingestActive ? 'url(#lab-glow)' : undefined}
            />
            <text x={s.x + 16} y={s.y + 4} fill="var(--lab-blue)" fontSize={12} className="font-mono" opacity={0.7}>
              {s.label}
            </text>
          </g>
        ))}
        {TRANSFORMS.map((t) => (
          <g key={t.label} className="transition-opacity duration-700" opacity={transformActive ? 1 : 0.3}>
            <rect
              x={t.x - 9}
              y={t.y - 9}
              width={18}
              height={18}
              rx={4}
              fill="none"
              stroke="var(--lab-purple)"
              strokeWidth={2}
              filter={transformActive ? 'url(#lab-glow)' : undefined}
            />
            <text x={t.x + 18} y={t.y + 4} fill="var(--lab-purple)" fontSize={12} className="font-mono" opacity={0.7}>
              {t.label}
            </text>
          </g>
        ))}
        <g className="transition-opacity duration-1000" opacity={outputActive ? 1 : 0}>
          <circle cx={OUTPUT.x} cy={OUTPUT.y} r={22} fill="none" stroke="var(--lab-cyan)" strokeWidth={1} opacity={0.5} />
          <circle cx={OUTPUT.x} cy={OUTPUT.y} r={10} fill="var(--lab-cyan)" filter="url(#lab-glow)" />
          <text x={OUTPUT.x - 52} y={OUTPUT.y + 44} fill="var(--lab-cyan)" fontSize={12} className="font-mono">
            {OUTPUT.label}
          </text>
        </g>
      </svg>
      )}

      {!quiet && PARTICLES.map((p, i) => (
        <span
          key={i}
          className="animate-drift absolute rounded-full bg-lab-cyan/70"
          style={{ left: p.left, top: p.top, width: p.size, height: p.size, animationDelay: p.delay }}
        />
      ))}

      {!quiet && <div className="lab-scanlines absolute inset-0" />}
      {!quiet && <div className="lab-scanbar absolute inset-x-0 top-0 h-40" />}
    </div>
  )
}
