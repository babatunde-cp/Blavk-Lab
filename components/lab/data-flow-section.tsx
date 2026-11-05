const stages = [
  {
    number: '01',
    title: 'SOURCE & INGEST',
    tone: 'from-sky-400/25 via-card/80 to-blue-500/12 border-sky-400/35',
    copy: [
      'Bring in approved data from APIs, Excel, CSV files, databases, or the web using Power Query, Python, or Azure Data Factory.',
      'Record the source, arrival time, and batch ID so every load can be traced.',
    ],
  },
  {
    number: '02',
    title: 'LAND & ACCESS',
    tone: 'from-cyan-400/25 via-card/80 to-teal-500/12 border-cyan-400/35',
    copy: [
      'Keep a recoverable raw copy in a database or storage layer before shaping the data.',
      'Apply access controls and organize larger datasets so they remain practical to query.',
    ],
  },
  {
    number: '03',
    title: 'PROFILE & VALIDATE',
    tone: 'from-teal-400/25 via-card/80 to-emerald-500/12 border-teal-400/35',
    copy: [
      'Check schemas, required fields, duplicates, missing values, and ranges with SQL, Excel, or Python.',
      'Flag unexpected records early and keep clear counts of accepted and rejected rows.',
    ],
  },
  {
    number: '04',
    title: 'TRANSFORM & MODEL',
    tone: 'from-blue-400/25 via-card/80 to-indigo-500/12 border-blue-400/35',
    copy: [
      'Standardize formats, join related data, and shape reusable models with SQL, Power Query, or dbt.',
      'Use stable keys and documented business rules to keep outputs consistent.',
    ],
  },
  {
    number: '05',
    title: 'QUERY & ANALYZE',
    tone: 'from-indigo-400/25 via-card/80 to-violet-500/12 border-indigo-400/35',
    copy: [
      'Answer business questions with SQL, Excel formulas, PivotTables, and Power BI measures.',
      'Compare trends and segments, then reconcile key calculations with the source data.',
    ],
  },
  {
    number: '06',
    title: 'VISUALIZE & DELIVER',
    tone: 'from-violet-400/25 via-card/80 to-fuchsia-500/12 border-violet-400/35',
    copy: [
      'Present useful findings in Power BI or Tableau with clear definitions and focused visuals.',
      'Publish through Power BI Service or Tableau Cloud and schedule refreshes when needed.',
    ],
  },
  {
    number: '07',
    title: 'SCHEDULE & RERUN',
    tone: 'from-fuchsia-400/25 via-card/80 to-sky-500/12 border-fuchsia-400/35',
    copy: [
      'Automate repeatable jobs with Azure Data Factory, dbt Cloud, or scheduled refresh.',
      'Use stable keys, merge or upsert logic, and bounded retries so reruns do not duplicate records.',
    ],
  },
  {
    number: '08',
    title: 'TEST & RELEASE',
    tone: 'from-slate-400/25 via-card/80 to-cyan-500/12 border-slate-400/35',
    copy: [
      'Check transformations, totals, edge cases, and failure handling before release with SQL checks and dbt tests.',
      'Track code changes in GitHub and keep a rollback path ready for production issues.',
    ],
  },
  {
    number: '09',
    title: 'MONITOR & OPTIMIZE',
    tone: 'from-emerald-400/25 via-card/80 to-blue-500/12 border-emerald-400/35',
    copy: [
      'Watch freshness, failures, row counts, runtime, and refresh costs through job logs and service monitoring.',
      'Tune slow queries and oversized refreshes, then alert on issues before they affect decisions.',
    ],
  },
  {
    number: '10',
    title: 'MAKE THE DATA COUNT',
    tone: 'from-amber-400/30 via-card/80 to-lime-400/15 border-amber-400/40',
    copy: [
      'The data is ready, the insights are clear, and it is time to turn smart decisions into real progress 💃😊.',
    ],
    finale: true,
  },
] as const

export function DataFlowSection() {
  return (
    <section id="data-flow" className="relative scroll-mt-20 border-t border-lab-blue/20 px-4 py-16 sm:px-8 sm:py-24" aria-labelledby="data-flow-heading">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_18%_12%,oklch(0.55_0.16_205_/_0.10),transparent_42%),radial-gradient(ellipse_at_88%_80%,oklch(0.5_0.18_260_/_0.08),transparent_40%)]" />
      <div className="relative z-10 mx-auto max-w-4xl">
        <header className="max-w-2xl">
          <p className="font-mono text-[10px] tracking-[0.2em] text-lab-cyan">FROM RAW INPUT TO USEFUL OUTPUT</p>
          <h2 id="data-flow-heading" className="mt-3 text-balance font-mono text-2xl font-semibold tracking-[0.06em] text-foreground sm:text-3xl">HOW YOUR DATA SHOULD FLOW</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">A practical route from incoming data to reliable decisions.</p>
        </header>

        <ol className="mt-8 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
          {stages.map((stage) => (
            <li key={stage.number} className={`min-w-0 rounded-xl border bg-gradient-to-br p-4 shadow-[0_14px_44px_-36px_var(--lab-blue)] sm:p-5 ${stage.tone}`}>
              <div className="flex items-start gap-3">
                <span className="shrink-0 rounded-md border border-current/15 bg-background/45 px-2 py-1 font-mono text-[11px] tracking-wider text-lab-cyan">{stage.number} -</span>
                <h3 className="pt-1 font-mono text-xs font-semibold tracking-[0.1em] text-foreground sm:text-sm">{stage.title}</h3>
              </div>
              <div className="mt-4 space-y-2 border-t border-border/70 pt-3 text-sm leading-6 text-muted-foreground sm:text-base">
                {stage.copy.map((sentence) => <p key={sentence}>{sentence}</p>)}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
