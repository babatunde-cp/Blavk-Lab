'use client'

import { useEffect, useRef } from 'react'

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

/** A quiet scroll progress indicator plus one-time viewport reveals for marked sections. */
export function ScrollMotion() {
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bar = progressRef.current
    const media = window.matchMedia(REDUCED_MOTION)
    let frame = 0

    const updateProgress = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight
        const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0
        if (bar) {
          bar.style.transform = `scaleX(${progress})`
          bar.setAttribute('aria-valuenow', String(Math.round(progress * 100)))
        }
      })
    }

    const revealTargets = new Set<HTMLElement>()
    let observer: IntersectionObserver | undefined
    let mutations: MutationObserver | undefined
    const registerTargets = (root: ParentNode) => {
      const targets = root instanceof HTMLElement && root.matches('[data-scroll-reveal]')
        ? [root, ...root.querySelectorAll<HTMLElement>('[data-scroll-reveal]')]
        : Array.from(root.querySelectorAll<HTMLElement>('[data-scroll-reveal]'))
      targets.forEach((target) => {
        if (revealTargets.has(target)) return
        revealTargets.add(target)
        if (media.matches || !observer) {
          target.setAttribute('data-in-view', 'true')
        } else {
          const bounds = target.getBoundingClientRect()
          if (bounds.top < window.innerHeight * 0.92 && bounds.bottom > 0) target.setAttribute('data-in-view', 'true')
          else observer.observe(target)
        }
      })
    }
    const applyMotionPreference = () => {
      observer?.disconnect()
      document.documentElement.classList.remove('scroll-motion-ready')
      revealTargets.forEach((target) => target.removeAttribute('data-in-view'))
      revealTargets.clear()
      if (media.matches || !('IntersectionObserver' in window)) return

      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement
            target.setAttribute('data-in-view', 'true')
            observer?.unobserve(target)
          }
        })
      }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' })

      registerTargets(document)
      document.documentElement.classList.add('scroll-motion-ready')
    }

    updateProgress()
    applyMotionPreference()
    mutations = new MutationObserver((records) => {
      records.forEach((record) => record.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) registerTargets(node)
      }))
    })
    mutations.observe(document.body, { childList: true, subtree: true })
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)
    media.addEventListener('change', applyMotionPreference)

    return () => {
      cancelAnimationFrame(frame)
      observer?.disconnect()
      mutations?.disconnect()
      document.documentElement.classList.remove('scroll-motion-ready')
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
      media.removeEventListener('change', applyMotionPreference)
    }
  }, [])

  return (
    <div
      ref={progressRef}
      className="portfolio-scroll-progress fixed inset-x-0 top-0 z-[60] h-[2px] origin-left scale-x-0 bg-gradient-to-r from-sky-400 via-cyan-300 to-violet-400 shadow-[0_0_12px_rgba(56,189,248,.45)]"
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
    />
  )
}
