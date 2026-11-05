'use client'

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { archiveProjects, archiveToolGroups, engineeringProjects, type ArchiveProject, type ProjectTool } from '@/lib/project-archive'

const CATEGORY = 'ANALYTICS'
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'
const prefersReducedMotion = () => window.matchMedia(REDUCED_MOTION).matches

function useReducedMotion() {
  return useSyncExternalStore(
    (callback) => {
      const query = window.matchMedia(REDUCED_MOTION)
      query.addEventListener('change', callback)
      return () => query.removeEventListener('change', callback)
    },
    prefersReducedMotion,
    () => false,
  )
}

function OceanicAtmosphere() {
  const particles = [8, 22, 38, 53, 68, 82, 94]
  return (
    <div aria-hidden="true" className="ocean-archive-atmosphere">
      <div className="ocean-archive-grid" />
      <div className="ocean-archive-light" />
      <svg className="ocean-archive-chart" viewBox="0 0 1200 680" preserveAspectRatio="none">
        <path className="ocean-current ocean-current-one" d="M-40 260 C180 80 310 430 520 270 S880 90 1240 260" />
        <path className="ocean-current ocean-current-two" d="M-40 520 C170 380 320 620 560 440 S930 280 1240 430" />
        <path className="ocean-current ocean-current-three" d="M30 120 C250 245 360 90 520 180 S860 340 1170 140" />
        <g className="ocean-chart-lines">
          <path d="M750 110h330v170H750z M770 250l54-42 45 19 53-73 48 21 48-36 41 16" />
          <path d="M830 430h255v125H830z M850 530v-30h32v30m17 0v-58h32v58m17 0v-75h32v75m17 0v-46h32v46m17 0v-89h32v89" />
        </g>
        <g className="ocean-nodes">
          <circle cx="205" cy="335" r="4" /><circle cx="445" cy="310" r="4" /><circle cx="615" cy="438" r="4" />
          <circle cx="905" cy="300" r="4" /><circle cx="1070" cy="390" r="4" />
        </g>
      </svg>
      {particles.map((left, index) => (
        <span key={left} className="ocean-particle" style={{ left: `${left}%`, top: `${16 + ((index * 31) % 70)}%`, animationDelay: `${index * -1.8}s` }} />
      ))}
    </div>
  )
}

function ProjectPreview({ project }: { project: ArchiveProject }) {
  return (
    <div className="relative mt-4 flex aspect-video items-center justify-center overflow-hidden rounded-md border border-lab-blue/20 bg-[#081323]">
      {project.image ? (
        <img src={project.image} alt={project.imageAlt ?? ''} loading="lazy" decoding="async" className="h-full w-full object-contain" />
      ) : <>
      <svg aria-hidden="true" viewBox="0 0 320 120" className="h-full w-full p-3 text-lab-cyan/70">
        <path d="M10 100H310M10 68H310M10 36H310" stroke="currentColor" strokeOpacity=".12" />
        {project.preview === 'bars' && <g fill="currentColor" opacity=".65"><rect x="32" y="62" width="28" height="38" rx="3"/><rect x="82" y="40" width="28" height="60" rx="3"/><rect x="132" y="50" width="28" height="50" rx="3"/><rect x="182" y="25" width="28" height="75" rx="3"/><rect x="232" y="43" width="28" height="57" rx="3"/></g>}
        {project.preview === 'line' && <><path d="M20 89 C60 78 65 34 105 55 S156 88 184 53 S224 40 246 48 S275 20 300 28" fill="none" stroke="currentColor" strokeWidth="3"/><g fill="currentColor"><circle cx="105" cy="55" r="4"/><circle cx="184" cy="53" r="4"/><circle cx="246" cy="48" r="4"/><circle cx="300" cy="28" r="4"/></g></>}
        {project.preview === 'network' && <g stroke="currentColor" strokeWidth="2" fill="currentColor"><path d="M68 58 148 30 235 58 155 92 68 58M148 30l7 62m80-34-80 34" fill="none" opacity=".55"/><circle cx="68" cy="58" r="8"/><circle cx="148" cy="30" r="8"/><circle cx="235" cy="58" r="8"/><circle cx="155" cy="92" r="8"/></g>}
        {project.preview === 'campaign' && <><path d="M30 85 78 62l46 9 47-44 43 25 39-18 37 14" fill="none" stroke="currentColor" strokeWidth="3"/><g fill="currentColor"><circle cx="78" cy="62" r="4"/><circle cx="124" cy="71" r="4"/><circle cx="171" cy="27" r="4"/><circle cx="214" cy="52" r="4"/><circle cx="253" cy="34" r="4"/></g></>}
        {project.preview === 'schema' && <g fill="none" stroke="currentColor" strokeWidth="2"><rect x="28" y="25" width="76" height="68" rx="6"/><rect x="217" y="25" width="76" height="68" rx="6"/><rect x="122" y="42" width="76" height="68" rx="6"/><path d="M104 57h18m76 18h19M42 43h46m-46 14h37m-37 14h43m109-28h46m-46 14h37m-37 14h43m-103-2h29m-29 14h37"/></g>}
      </svg>
      <span className="absolute bottom-2 left-3 font-mono text-[9px] tracking-[0.18em] text-muted-foreground">ILLUSTRATIVE PREVIEW</span>
      </>}
    </div>
  )
}

function ProjectCard({ project }: { project: ArchiveProject }) {
  const [flipped, setFlipped] = useState(false)
  const flip = useCallback(() => setFlipped((current) => !current), [])
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.repeat) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      flip()
    }
  }

  return (
    <div className="min-w-0">
      <div
        className="project-flip-control h-[370px] w-full cursor-pointer rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lab-cyan focus-visible:ring-offset-4 focus-visible:ring-offset-background"
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        aria-label={flipped ? `Show preview for ${project.title}` : `Show details for ${project.title}`}
        onClick={flip}
        onKeyDown={handleKeyDown}
      >
        <div className={`project-flip-inner relative h-full w-full ${flipped ? 'is-flipped' : ''}`}>
          <article className="project-flip-face absolute inset-0 flex flex-col overflow-hidden rounded-xl border border-border/80 bg-card/95 p-5 shadow-[0_18px_55px_-38px_var(--lab-blue)] sm:p-6" aria-hidden={flipped}>
            <div className="flex items-center justify-between gap-3">
              <span className={`inline-flex items-center gap-2 font-mono text-[10px] tracking-wider ${project.status === 'Completed' ? 'text-emerald-300' : 'text-red-300'}`}>
                <span aria-hidden="true" className={`h-2 w-2 rounded-full ${project.status === 'Completed' ? 'status-dot-completed bg-emerald-400' : 'bg-red-400'}`} />
                {project.status.toUpperCase()}
              </span>
            </div>
            <h3 className="mt-3 text-lg font-semibold leading-snug text-foreground sm:text-xl">{project.title}</h3>
            <ProjectPreview project={project} />
          </article>
          <article className="project-flip-face project-flip-back absolute inset-0 flex flex-col overflow-y-auto rounded-xl border border-lab-blue/35 bg-[#071326] p-5 text-left shadow-[0_18px_55px_-38px_var(--lab-blue)] sm:p-6" aria-hidden={!flipped}>
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[10px] tracking-[0.18em] text-lab-cyan">PROJECT DETAILS</span>
              <span className={`inline-flex items-center gap-2 font-mono text-[10px] ${project.status === 'Completed' ? 'text-emerald-300' : 'text-red-300'}`}>
                <span aria-hidden="true" className={`h-2 w-2 rounded-full ${project.status === 'Completed' ? 'status-dot-completed bg-emerald-400' : 'bg-red-400'}`} />
                {project.status.toUpperCase()}
              </span>
            </div>
            <h3 className="mt-3 text-lg font-semibold leading-snug text-foreground sm:text-xl">{project.title}</h3>
            <p className="mt-2 text-xs leading-5 text-slate-300 sm:text-sm sm:leading-5">{project.details}</p>
            <div className="mt-auto flex flex-wrap gap-1.5 pt-3">
              {project.tools.map((tool) => <span key={tool} className="rounded border border-lab-blue/25 bg-lab-blue/10 px-2 py-1 font-mono text-[9px] text-slate-200">{tool}</span>)}
            </div>
          </article>
        </div>
      </div>
      {project.projectUrl ? (
        <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.title} project on GitHub (opens in a new tab)`} className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-lab-blue/45 bg-lab-blue/5 px-4 py-2.5 font-mono text-xs tracking-[0.14em] text-lab-cyan transition-colors hover:border-lab-cyan/70 hover:bg-lab-cyan/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lab-cyan">
          VIEW PROJECT <span aria-hidden="true">↗</span>
        </a>
      ) : (
        <p className="mt-3 flex min-h-11 w-full items-center justify-center rounded-lg border border-border px-4 py-2.5 font-mono text-xs tracking-[0.14em] text-muted-foreground">{project.status.toUpperCase()}</p>
      )}
    </div>
  )
}

export function ProjectArchive() {
  const reducedMotion = useReducedMotion()
  const categoryRef = useRef<HTMLElement>(null)
  const categoryJumped = useRef(false)
  const [categoryStarted, setCategoryStarted] = useState(false)
  const [typedCharacters, setTypedCharacters] = useState(0)
  const [visibleGroups, setVisibleGroups] = useState(0)
  const initialized = typedCharacters >= CATEGORY.length
  const engineeringRef = useRef<HTMLElement>(null)
  const engineeringJumped = useRef(false)
  const [engineeringStarted, setEngineeringStarted] = useState(false)
  const [engineeringTyped, setEngineeringTyped] = useState(0)
  const engineeringInitialized = engineeringTyped >= 'ENGINEERING'.length

  useEffect(() => {
    const element = categoryRef.current
    if (!element || categoryStarted) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setCategoryStarted(true)
        observer.disconnect()
      }
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' })
    observer.observe(element)
    return () => observer.disconnect()
  }, [categoryStarted])

  useEffect(() => {
    const revealForHash = () => {
      const targetId = window.location.hash.slice(1)
      if (targetId === 'analytics' || targetId === 'analytics-category-heading' || targetId.startsWith('tool-')) {
        categoryJumped.current = true
        setCategoryStarted(true)
        setTypedCharacters(CATEGORY.length)
        setVisibleGroups(archiveToolGroups.length)
      }
      if (targetId === 'engineering' || targetId === 'engineering-category-heading') {
        categoryJumped.current = true
        engineeringJumped.current = true
        setCategoryStarted(true)
        setTypedCharacters(CATEGORY.length)
        setVisibleGroups(archiveToolGroups.length)
        setEngineeringStarted(true)
        setEngineeringTyped('ENGINEERING'.length)
      }
    }
    revealForHash()
    window.addEventListener('hashchange', revealForHash)
    return () => window.removeEventListener('hashchange', revealForHash)
  }, [])

  useEffect(() => {
    const targetId = window.location.hash.slice(1)
    if (!targetId) return
    const targetReady =
      (targetId === 'tool-excel' || targetId === 'tool-power-bi' || targetId === 'tool-sql')
        ? visibleGroups === archiveToolGroups.length
        : targetId === 'engineering'
          ? engineeringInitialized
          : true
    if (!targetReady) return
    const timeout = window.setTimeout(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' })
    }, 80)
    return () => window.clearTimeout(timeout)
  }, [visibleGroups, engineeringInitialized, reducedMotion])

  useEffect(() => {
    if (!categoryStarted) return
    if (reducedMotion || categoryJumped.current) {
      setTypedCharacters(CATEGORY.length)
      return
    }
    let count = 0
    const timer = window.setInterval(() => {
      count += 1
      setTypedCharacters(count)
      if (count >= CATEGORY.length) window.clearInterval(timer)
    }, 34)
    return () => window.clearInterval(timer)
  }, [categoryStarted, reducedMotion])

  useEffect(() => {
    if (!initialized) return
    if (reducedMotion || categoryJumped.current) {
      setVisibleGroups(archiveToolGroups.length)
      return
    }
    const timers = archiveToolGroups.map((_, index) => window.setTimeout(() => setVisibleGroups(index + 1), index * 150))
    return () => timers.forEach(window.clearTimeout)
  }, [initialized, reducedMotion])

  useEffect(() => {
    const element = engineeringRef.current
    if (!element || engineeringStarted) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setEngineeringStarted(true)
        observer.disconnect()
      }
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' })
    observer.observe(element)
    return () => observer.disconnect()
  }, [engineeringStarted])

  useEffect(() => {
    if (!engineeringStarted) return
    if (reducedMotion || engineeringJumped.current) {
      setEngineeringTyped('ENGINEERING'.length)
      return
    }
    let count = 0
    const timer = window.setInterval(() => {
      count += 1
      setEngineeringTyped(count)
      if (count >= 'ENGINEERING'.length) window.clearInterval(timer)
    }, 34)
    return () => window.clearInterval(timer)
  }, [engineeringStarted, reducedMotion])

  return (
    <section id="index-logs" className="ocean-archive relative isolate mt-20 scroll-mt-20 overflow-hidden border-y border-lab-blue/15 px-4 py-16 sm:mt-28 sm:px-8 sm:py-24" aria-labelledby="selected-works-heading">
      <OceanicAtmosphere />
      <div className="relative z-10 mx-auto max-w-4xl">
        <header className="max-w-2xl">
          <h2 id="selected-works-heading" className="inline-flex rounded-md border border-lab-blue/25 bg-lab-blue/5 px-3 py-2 font-mono text-lg font-semibold tracking-[0.12em] text-lab-cyan sm:text-xl"><code>INDEX_LOGS</code></h2>
        </header>

        <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 border-y border-lab-blue/15 py-3 font-mono text-[9px] tracking-[0.13em] text-muted-foreground sm:gap-x-5 sm:text-[10px]" aria-label="Illustrative analytical flow">
          <span className="text-lab-cyan/80">ANALYTICAL FLOW · ILLUSTRATIVE</span>
          <span aria-hidden="true" className="hidden h-px min-w-4 flex-1 bg-gradient-to-r from-lab-cyan/50 via-lab-blue/30 to-transparent sm:block" />
          <span>SOURCE DATA <b className="px-1 text-lab-cyan">→</b> EXCEL · POWER BI · SQL <b className="px-1 text-lab-cyan">→</b> ANALYSIS <b className="px-1 text-lab-cyan">→</b> INSIGHTS</span>
        </div>

        <section id="analytics" ref={categoryRef} className="relative mt-14 scroll-mt-24" aria-labelledby="analytics-category-heading">
          <div className="archive-flow-track mb-5" aria-hidden="true"><span className={categoryStarted ? 'archive-flow-sweep' : ''} /></div>
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-lab-blue/20 pb-5">
            <div>
              <h3 id="analytics-category-heading" className="mt-2 min-h-[2.3rem] font-mono text-xl font-semibold tracking-[0.08em] text-foreground sm:text-2xl">{categoryStarted ? CATEGORY.slice(0, reducedMotion ? CATEGORY.length : typedCharacters) : ''}<span className={categoryStarted && !initialized && !reducedMotion ? 'archive-caret' : 'sr-only'} aria-hidden="true">|</span></h3>
            </div>
            {initialized && <p className="animate-fade-up font-mono text-[10px] tracking-[0.14em] text-lab-cyan motion-reduce:animate-none" role="status">[CATEGORY INITIALIZED]</p>}
          </div>

          <div className="mt-7 space-y-10 sm:mt-9 sm:space-y-14">
            {archiveToolGroups.map(({ tool, description }, index) => visibleGroups > index && (
              <section id={`tool-${tool.toLowerCase().replace(/\s+/g, '-')}`} key={tool} className="animate-fade-up scroll-mt-24 motion-reduce:animate-none" aria-labelledby={`tool-${tool.toLowerCase().replace(/\s+/g, '-')}-heading`}>
                <div className="mb-5 flex flex-col gap-1.5 border-l-2 border-lab-cyan/50 pl-4 sm:mb-6 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
                  <div>
                    <h4 id={`tool-${tool.toLowerCase().replace(/\s+/g, '-')}-heading`} className="text-xl font-semibold tracking-wide text-foreground sm:text-2xl">{tool.toUpperCase()}</h4>
                  </div>
                  <p className="max-w-xl text-sm leading-6 text-muted-foreground">{description}</p>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
                  {archiveProjects.filter((project) => project.tool === (tool as ProjectTool)).map((project) => <ProjectCard key={project.id} project={project} />)}
                </div>
              </section>
            ))}
          </div>
        </section>

        <section id="engineering" ref={engineeringRef} className="relative mt-24 scroll-mt-24 border-t border-lab-blue/20 pt-12 sm:mt-32 sm:pt-16" aria-labelledby="engineering-category-heading">
          <div className="archive-flow-track mb-5" aria-hidden="true"><span className={engineeringStarted ? 'archive-flow-sweep' : ''} /></div>
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-lab-blue/20 pb-5">
            <div>
              <h3 id="engineering-category-heading" className="mt-2 min-h-[2.3rem] font-mono text-xl font-semibold tracking-[0.08em] text-foreground sm:text-2xl">{engineeringStarted ? 'ENGINEERING'.slice(0, reducedMotion ? 'ENGINEERING'.length : engineeringTyped) : ''}<span className={engineeringStarted && !engineeringInitialized && !reducedMotion ? 'archive-caret' : 'sr-only'} aria-hidden="true">|</span></h3>
            </div>
            {engineeringInitialized && <p className="animate-fade-up font-mono text-[10px] tracking-[0.14em] text-lab-cyan motion-reduce:animate-none" role="status">[CATEGORY INITIALIZED]</p>}
          </div>
          {engineeringInitialized && (
            <div className="mt-7 space-y-10 animate-fade-up motion-reduce:animate-none">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
                {engineeringProjects.map((project) => <ProjectCard key={project.id} project={project} />)}
              </div>
              <aside className="relative overflow-hidden rounded-xl border border-lab-cyan/20 bg-gradient-to-r from-lab-blue/10 via-slate-950/35 to-lab-cyan/5 px-5 py-6 sm:px-7 sm:py-8" aria-label="More projects coming soon">
                <div aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-lab-cyan/70 via-lab-blue/40 to-transparent" />
                <p className="font-mono text-[10px] tracking-[0.2em] text-lab-cyan">NEXT_SIGNAL <span className="text-muted-foreground">// INCOMING</span></p>
                <p className="mt-2 text-base font-medium text-foreground sm:text-lg">More projects are on the horizon.</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">Check back soon for the next drop from the lab.</p>
              </aside>
            </div>
          )}
        </section>
      </div>
    </section>
  )
}
