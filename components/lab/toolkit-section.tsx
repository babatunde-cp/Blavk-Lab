const stages = [
  {
    number: '01', title: 'SOURCE & INGESTION',
    analytics: ['Excel', 'CSV', 'Google Sheets', 'Power Query connectors'],
    engineering: ['Python Requests', 'Azure Data Factory', 'AWS Glue'],
  },
  {
    number: '02', title: 'STORE & ACCESS',
    analytics: ['SQL Server', 'PostgreSQL', 'MySQL'],
    engineering: ['BigQuery', 'Databricks', 'DuckDB'],
  },
  {
    number: '03', title: 'CLEAN & VALIDATE',
    analytics: ['Excel cleaning tools', 'Excel Data Validation', 'Power Query', 'SQL'],
    engineering: ['Python · pandas', 'dbt tests'],
  },
  {
    number: '04', title: 'TRANSFORM & MODEL',
    analytics: ['Power Query', 'SQL', 'Power Pivot', 'DAX'],
    engineering: ['dbt', 'PySpark', 'Apache Spark'],
  },
  {
    number: '05', title: 'ANALYZE & MEASURE',
    analytics: ['Excel formulas', 'PivotTables', 'SQL', 'Power BI · DAX'],
    engineering: ['Python · pandas', 'NumPy', 'Jupyter Notebook'],
  },
  {
    number: '06', title: 'VISUALIZE & COMMUNICATE',
    analytics: ['Power BI', 'Tableau', 'Excel charts', 'Power BI Service'],
    engineering: [],
  },
  {
    number: '07', title: 'ORCHESTRATE & AUTOMATE',
    analytics: ['Power BI scheduled refresh', 'Power Automate', 'Excel Office Scripts'],
    engineering: ['Azure Data Factory', 'dbt Cloud'],
  },
  {
    number: '08', title: 'DEVELOP & VERSION',
    analytics: ['Power BI Desktop', 'DAX Studio', 'Tabular Editor'],
    engineering: ['VS Code', 'Git', 'GitHub', 'Docker', 'JupyterLab'],
  },
  {
    number: '09', title: 'DELIVER & MONITOR',
    analytics: ['Power BI Service', 'Tableau Cloud'],
    engineering: ['GitHub Actions'],
  },
] as const

function ToolGroup({ label, tools, tone }: { label: string; tools: readonly string[]; tone: 'analytics' | 'engineering' }) {
  return (
    <div className="min-w-0">
      <h4 className={`font-mono text-[10px] tracking-[0.16em] ${tone === 'analytics' ? 'text-lab-cyan' : 'text-sky-300'}`}>{label}</h4>
      <ul className="mt-2 flex flex-wrap gap-2">
        {tools.map((tool) => (
          <li key={tool} className="rounded-md border border-border/80 bg-background px-2.5 py-1.5 text-xs leading-5 text-foreground sm:text-[13px]">{tool}</li>
        ))}
      </ul>
    </div>
  )
}

export function ToolkitSection() {
  return (
    <section id="toolkits" className="relative scroll-mt-20 border-t border-lab-blue/20 px-4 py-16 sm:px-8 sm:py-24" aria-labelledby="toolkits-heading">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_0%,oklch(0.55_0.16_225_/_0.10),transparent_48%)]" />
      <div className="relative z-10 mx-auto max-w-4xl">
        <header className="max-w-2xl">
          <p className="font-mono text-[10px] tracking-[0.2em] text-lab-cyan">DATA LIFECYCLE <span className="text-muted-foreground">/ ANALYTICS + ENGINEERING</span></p>
          <h2 id="toolkits-heading" className="mt-3 font-mono text-2xl font-semibold tracking-[0.12em] text-foreground sm:text-3xl">TOOLKITS</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">A connected map of tools for taking data from source to reliable, useful outputs.</p>
        </header>

        <ol className="mt-8 space-y-4">
          {stages.map((stage) => (
            <li key={stage.number} className="relative grid min-w-0 grid-cols-1 gap-3 rounded-xl border border-border/80 bg-card/90 p-4 shadow-[0_14px_44px_-36px_var(--lab-blue)] sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:gap-5 sm:p-5">
              <div className="flex items-center gap-3 sm:block">
                <span className="font-mono text-xs tracking-widest text-lab-cyan">STAGE {stage.number}</span>
                <h3 className="font-mono text-[11px] font-semibold tracking-[0.1em] text-foreground sm:mt-2 sm:leading-5">{stage.title}</h3>
              </div>
              <div className={`grid min-w-0 grid-cols-1 gap-4 border-t border-border/70 pt-4 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0 ${stage.analytics.length && stage.engineering.length ? 'sm:grid-cols-2' : 'sm:grid-cols-1'}`}>
                {stage.analytics.length > 0 && <ToolGroup label="ANALYTICS" tools={stage.analytics} tone="analytics" />}
                {stage.engineering.length > 0 && <ToolGroup label="ENGINEERING" tools={stage.engineering} tone="engineering" />}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
