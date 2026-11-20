'use client'

import { useState } from 'react'

const stages = [
  {
    id: 'source',
    label: 'SOURCE',
    tone: 'tone-cyan',
    headline: 'Three Excel workbooks',
    description: 'Sales transactions, customer and product masters, inventory snapshots, and inventory movements enter through five sheets.',
    output: '3 workbooks · 5 sheets',
  },
  {
    id: 'raw',
    label: 'RAW',
    tone: 'tone-sky',
    headline: 'Preserve the input',
    description: 'Every source sheet is copied into the raw layer before transformation, so the original values remain available for traceability.',
    output: 'Untouched source copy',
  },
  {
    id: 'quality',
    label: 'QUALITY',
    tone: 'tone-amber',
    headline: 'Make each row accountable',
    description: 'Rules fix known formatting issues, flag rows that need attention, or quarantine rows that should not enter the curated model.',
    output: 'Fix · flag · quarantine',
  },
  {
    id: 'staging',
    label: 'STAGING',
    tone: 'tone-teal',
    headline: 'Keep clean rows moving',
    description: 'Rows that pass the rules are standardized in staging. Rejected rows stay in quarantine with a reason code instead of disappearing silently.',
    output: 'Clean rows + reasoned rejects',
  },
  {
    id: 'curated',
    label: 'CURATED',
    tone: 'tone-violet',
    headline: 'Model for analysis',
    description: 'The curated SQL Server layer organizes the data into three fact tables and six dimensions for consistent reporting.',
    output: '3 facts · 6 dimensions',
  },
  {
    id: 'reporting',
    label: 'REPORTING',
    tone: 'tone-emerald',
    headline: 'Check, then report',
    description: 'Thirteen reporting views answer the project questions. Run logs, reconciliation queries, automated tests, and independent view checks help verify the outputs.',
    output: '13 views · 31 tests · 18 view checks',
  },
] as const

const qualityRows = [
  { id: 'sales', name: 'Sales transactions', raw: 65_000, clean: 64_233, quarantine: 767 },
  { id: 'snapshot', name: 'Inventory snapshot', raw: 120, clean: 115, quarantine: 5 },
  { id: 'movements', name: 'Inventory movements', raw: 15_000, clean: 14_970, quarantine: 30 },
] as const

type SourceFilter = 'all' | (typeof qualityRows)[number]['id']
const numberFormat = new Intl.NumberFormat('en-US')

function QualityChart() {
  const [source, setSource] = useState<SourceFilter>('all')
  const rows = source === 'all' ? qualityRows : qualityRows.filter((row) => row.id === source)
  const filters: { id: SourceFilter; label: string }[] = [
    { id: 'all', label: 'All feeds' },
    { id: 'sales', label: 'Sales' },
    { id: 'snapshot', label: 'Snapshot' },
    { id: 'movements', label: 'Movements' },
  ]

  return (
    <div className="mt-6 rounded-lg border border-border/80 bg-background/35 p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h5 className="font-mono text-xs font-semibold tracking-[0.12em] text-foreground">QUALITY RESULTS BY FEED</h5>
          <p className="mt-1 text-xs text-muted-foreground">Select a feed to focus the row counts.</p>
        </div>
        <div className="flex flex-wrap gap-2" aria-label="Filter quality chart by source">
          {filters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              aria-pressed={source === filter.id}
              onClick={() => setSource(filter.id)}
              className={`min-h-9 rounded-md border px-3 font-mono text-[10px] tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lab-cyan motion-reduce:transition-none ${source === filter.id ? 'border-lab-cyan/50 bg-lab-cyan/10 text-lab-cyan' : 'border-border text-muted-foreground hover:border-lab-cyan/30 hover:text-foreground'}`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 space-y-5" aria-live="polite">
        {rows.map((row) => {
          const cleanPercent = (row.clean / row.raw) * 100
          const quarantinedPercent = (row.quarantine / row.raw) * 100
          return (
            <div key={row.id}>
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span className="text-sm font-medium text-foreground">{row.name}</span>
                <span className="font-mono text-[10px] text-muted-foreground">{numberFormat.format(row.raw)} source rows</span>
              </div>
              <div
                className="flex h-3 overflow-hidden rounded-full bg-white/5"
                role="img"
                aria-label={`${row.name}: ${numberFormat.format(row.clean)} clean (${cleanPercent.toFixed(2)} percent), ${numberFormat.format(row.quarantine)} quarantined (${quarantinedPercent.toFixed(2)} percent)`}
              >
                <span className="h-full bg-emerald-400/85 transition-[width] duration-500 motion-reduce:transition-none" style={{ width: `${cleanPercent}%` }} />
                <span className="h-full min-w-px bg-amber-400" style={{ width: `${quarantinedPercent}%` }} />
              </div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] text-muted-foreground">
                <span><span aria-hidden="true" className="mr-1.5 inline-block size-2 rounded-full bg-emerald-400" />Clean {numberFormat.format(row.clean)} ({cleanPercent.toFixed(2)}%)</span>
                <span><span aria-hidden="true" className="mr-1.5 inline-block size-2 rounded-full bg-amber-400" />Quarantined {numberFormat.format(row.quarantine)} ({quarantinedPercent.toFixed(2)}%)</span>
              </div>
            </div>
          )
        })}
      </div>
      <p className="mt-5 border-t border-border/70 pt-3 text-[11px] leading-5 text-muted-foreground">
        Counts are from the project documentation for the three fact feeds. The customer and product master sheets are reference inputs, not included in these bars.
      </p>
    </div>
  )
}

export function NorthstarPipelineExplorer() {
  const [activeStage, setActiveStage] = useState<(typeof stages)[number]['id']>('quality')
  const stageIndex = stages.findIndex((stage) => stage.id === activeStage)
  const stage = stages[stageIndex]

  return (
    <section id="northstar-pipeline" data-scroll-reveal className="relative mt-8 scroll-mt-24 overflow-hidden rounded-2xl border border-lab-cyan/20 bg-gradient-to-br from-[#09182a] via-[#07111f] to-[#0b1d28] p-5 shadow-[0_24px_70px_-48px_rgba(34,211,238,.35)] sm:p-7" aria-labelledby="northstar-explorer-heading">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:linear-gradient(to_right,rgba(125,170,200,.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(125,170,200,.18)_1px,transparent_1px)] [background-size:34px_34px]" />
      <div className="relative">
        <header className="flex flex-col gap-3 border-b border-border/70 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] text-lab-cyan">INTERACTIVE CASE STUDY</p>
            <h4 id="northstar-explorer-heading" className="mt-2 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">Northstar pipeline explorer</h4>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Follow the documented workflow from workbook intake to reporting. Choose a stage to inspect its purpose and output.</p>
          </div>
          <span className="shrink-0 rounded-full border border-emerald-400/25 bg-emerald-400/5 px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] text-emerald-300">PROJECT COMPLETE</span>
        </header>

        <nav className="mt-5 overflow-x-auto pb-2" aria-label="Northstar pipeline stages">
          <ol className="flex min-w-max items-center gap-2">
            {stages.map((item, index) => (
              <li key={item.id} className="flex items-center gap-2">
                <button
                  type="button"
                  aria-current={activeStage === item.id ? 'step' : undefined}
                  aria-controls="northstar-stage-detail"
                  onClick={() => setActiveStage(item.id)}
                  className={`lab-tone ${item.tone} min-h-11 rounded-md border px-3 py-2 font-mono text-[10px] tracking-[0.12em] transition-[border-color,background-color,color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lab-cyan motion-reduce:transition-none ${activeStage === item.id ? 'lab-tone-surface text-foreground' : 'border-border/70 bg-background/35 text-muted-foreground hover:border-[color:var(--portfolio-tone)] hover:text-foreground'}`}
                >
                  <span className="mr-2 opacity-65">0{index + 1}</span>{item.label}
                </button>
                {index < stages.length - 1 && <span aria-hidden="true" className="font-mono text-xs text-lab-cyan/45">→</span>}
              </li>
            ))}
          </ol>
        </nav>

        <div id="northstar-stage-detail" className="lab-tone tone-sky mt-3 rounded-xl border border-border/80 bg-card/50 p-4 sm:p-6" aria-live="polite">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="font-mono text-[10px] tracking-[0.16em] text-lab-cyan">STAGE 0{stageIndex + 1} / 0{stages.length} · {stage.label}</p>
              <h5 className="lab-tone-label mt-2 text-lg font-semibold sm:text-xl">{stage.headline}</h5>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">{stage.description}</p>
            </div>
            <div className="shrink-0 rounded-md border border-border/70 bg-background/45 px-3 py-2 font-mono text-xs text-foreground sm:text-right">
              <span className="block text-[9px] tracking-[0.15em] text-muted-foreground">STAGE OUTPUT</span>
              <span className="mt-1 block">{stage.output}</span>
            </div>
          </div>

          {stage.id === 'quality' && <QualityChart />}

          {stage.id === 'curated' && (
            <div className="mt-6 grid gap-3 sm:grid-cols-2" aria-label="Curated star schema summary">
              <div className="rounded-lg border border-lab-violet/25 bg-lab-violet/5 p-4">
                <p className="font-mono text-[10px] tracking-[0.14em] text-lab-violet">FACT TABLES</p>
                <p className="mt-2 text-sm text-foreground">Sales · inventory snapshot · inventory movement</p>
              </div>
              <div className="rounded-lg border border-lab-cyan/25 bg-lab-cyan/5 p-4">
                <p className="font-mono text-[10px] tracking-[0.14em] text-lab-cyan">DIMENSIONS</p>
                <p className="mt-2 text-sm text-foreground">Date · product · warehouse · customer · channel · order status</p>
              </div>
            </div>
          )}
        </div>
        <p className="mt-3 text-right font-mono text-[9px] tracking-wide text-muted-foreground">DOCUMENTED PROJECT DATA · NOT A LIVE PRODUCTION FEED</p>
      </div>
    </section>
  )
}
