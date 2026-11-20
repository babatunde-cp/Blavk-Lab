'use client'

import { useRef, useState } from 'react'
import { archiveProjects, engineeringProjects, type ArchiveProject } from '@/lib/project-archive'

const projectPool: readonly ArchiveProject[] = [...archiveProjects, ...engineeringProjects]
  .filter((project) => project.status === 'Completed')

export function QuickProjectDemo() {
  const [project, setProject] = useState<ArchiveProject | null>(null)
  const previousProjectId = useRef<string | null>(null)

  const pickProject = () => {
    const choices = projectPool.filter((item) => item.id !== previousProjectId.current)
    const next = choices[Math.floor(Math.random() * choices.length)]
    if (!next) return
    previousProjectId.current = next.id
    setProject(next)
  }

  return (
    <section id="quick-demo" className="relative mt-14 overflow-hidden rounded-2xl border border-lab-cyan/20 bg-gradient-to-br from-[#0b1a2d] via-[#101527] to-[#17142b] p-5 text-slate-100 shadow-[0_24px_70px_-50px_rgba(56,189,248,.6)] sm:mt-16 sm:p-7" aria-labelledby="quick-demo-heading">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:linear-gradient(to_right,rgba(125,170,200,.2)_1px,transparent_1px),linear-gradient(to_bottom,rgba(125,170,200,.2)_1px,transparent_1px)] [background-size:30px_30px]" />
      <div className="relative grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-10">
        <header className="flex flex-col items-start">
          <p className="font-mono text-[10px] tracking-[0.2em] text-cyan-300">PROJECT PICKER <span className="text-slate-500">/ ANALYTICS + ENGINEERING</span></p>
          <h2 id="quick-demo-heading" className="mt-3 text-xl font-semibold tracking-tight sm:text-2xl">See where the data leads.</h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">Let the lab pick a project for you. Each pick can surface a different piece of work, from dashboards and SQL to data engineering.</p>
          <button type="button" onClick={pickProject} className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-cyan-300/35 bg-cyan-300/10 px-4 py-2.5 font-mono text-[11px] font-medium tracking-[0.12em] text-cyan-100 transition-[background-color,border-color,transform] hover:-translate-y-0.5 hover:border-cyan-200/70 hover:bg-cyan-300/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 motion-reduce:transition-none">
            {project ? 'PICK ANOTHER PROJECT' : 'SURPRISE ME WITH A PROJECT'} <span aria-hidden="true">↗</span>
          </button>
          <p className="mt-auto pt-4 font-mono text-[9px] tracking-wide text-slate-500">{projectPool.length} COMPLETED PROJECTS IN THE PICKER</p>
        </header>

        <div aria-live="polite" aria-atomic="true" className="min-w-0">
          {project ? (
            <article key={project.id} className="animate-fade-up overflow-hidden rounded-xl border border-white/10 bg-slate-950/55 motion-reduce:animate-none">
              <div className="relative aspect-[16/8] overflow-hidden bg-gradient-to-br from-slate-900 via-[#101a2b] to-[#1d1933]">
                {project.image ? (
                  <img src={project.image} alt={project.imageAlt ?? `${project.title} project preview`} loading="lazy" decoding="async" className="h-full w-full object-contain p-2 sm:p-3" />
                ) : (
                  <div aria-hidden="true" className="flex h-full items-center justify-center font-mono text-sm tracking-[0.2em] text-cyan-200">BLAVK / DATA LAB</div>
                )}
                <span className="absolute left-3 top-3 rounded border border-white/10 bg-slate-950/85 px-2.5 py-1 font-mono text-[9px] tracking-[0.12em] text-cyan-100">
                  {project.category === 'Engineering' ? 'DATA ENGINEERING' : `${project.category} · ${project.tool.toUpperCase()}`}
                </span>
              </div>
              <div className="p-4 sm:p-5">
                <h3 className="text-base font-semibold leading-snug text-white sm:text-lg">{project.title}</h3>
                <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-300 sm:text-sm">{project.details}</p>
                {project.publishedScope && <p className="mt-3 border-l-2 border-cyan-300/55 pl-3 font-mono text-[10px] leading-5 text-cyan-100">{project.publishedScope}</p>}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.tools.slice(0, 4).map((tool) => <span key={tool} className="rounded border border-white/10 bg-white/5 px-2 py-1 font-mono text-[9px] text-slate-300">{tool}</span>)}
                </div>
                {project.projectUrl && (
                  <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-10 items-center gap-2 border-t border-white/10 pt-3 font-mono text-[10px] tracking-[0.13em] text-cyan-200 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">
                    OPEN THIS PROJECT <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
            </article>
          ) : (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed border-white/15 bg-slate-950/35 p-6 text-center sm:min-h-80">
              <div aria-hidden="true" className="mb-4 grid size-14 place-items-center rounded-full border border-cyan-300/25 bg-cyan-300/5 font-mono text-xl text-cyan-200">?</div>
              <p className="font-mono text-[10px] tracking-[0.18em] text-slate-300">YOUR PROJECT IS READY</p>
              <p className="mt-2 max-w-xs text-xs leading-5 text-slate-500">Tap “Surprise me” to reveal a project picked from Analytics or Engineering.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
