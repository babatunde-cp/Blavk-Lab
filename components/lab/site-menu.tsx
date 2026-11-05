'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'

const sections = [
  { label: 'ABOUT', detail: 'Beyond the data', id: 'about-me' },
  { label: 'PROJECTS', detail: 'Project archive', id: 'index-logs' },
  { label: 'TOOLKITS', detail: 'Data workflow', id: 'toolkits' },
  { label: 'DATA FLOW', detail: 'Raw to reliable', id: 'data-flow' },
] as const

export function SiteMenu() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelId = 'blavk-site-index'

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  const sectionHref = (id: string) => pathname === '/lab' ? `#${id}` : `/lab#${id}`

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-label={open ? 'Close site menu' : 'Open site menu'}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md px-2 font-mono text-[10px] tracking-[0.14em] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lab-cyan"
      >
        {open ? <X className="size-4" aria-hidden="true" /> : <Menu className="size-4" aria-hidden="true" />}
        <span>{open ? 'CLOSE' : 'MENU'}</span>
      </button>

      {open && (
        <nav
          id={panelId}
          aria-label="Website sections"
          className="absolute right-0 top-full z-50 mt-3 w-[min(19rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-lab-blue/50 bg-background p-3 shadow-[0_22px_70px_-24px_var(--lab-blue)]"
        >
          <p className="border-b border-border/80 px-2 pb-3 font-mono text-[10px] tracking-[0.18em] text-lab-cyan">SITE_INDEX <span className="text-muted-foreground">// 01</span></p>
          <ul className="mt-2 space-y-1">
            {sections.map(({ label, detail, id }, index) => (
              <li key={id}>
                <Link
                  href={sectionHref(id)}
                  onClick={() => {
                    setOpen(false)
                    if (pathname === '/lab' && !document.getElementById(id)) {
                      window.dispatchEvent(new Event('blavk:skip-profile-intro'))
                    }
                  }}
                  className="group flex min-h-10 items-center justify-between gap-4 rounded-md px-2.5 py-2 text-sm text-foreground transition-colors hover:bg-lab-blue/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lab-cyan"
                >
                  <span className="flex items-center gap-3">
                    <span className="font-mono text-[10px] text-muted-foreground">0{index + 1}</span>
                    <span className="font-mono text-xs tracking-[0.1em] group-hover:text-lab-cyan">{label}</span>
                  </span>
                  <span className="text-right text-[11px] text-muted-foreground">{detail}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex min-h-10 items-center justify-between rounded-md border-t border-border/80 px-2.5 pt-2 font-mono text-[10px] tracking-[0.1em]">
            <span className="text-muted-foreground">CONTACTS</span>
            <span className="text-lab-cyan/80">COMING SOON</span>
          </div>
        </nav>
      )}
    </div>
  )
}
