'use client'

import { useEffect, useEffectEvent, useRef, useState } from 'react'

type TypedTextProps = {
  text: string
  /** Milliseconds per character. */
  speed?: number
  instant?: boolean
  showCursor?: boolean
  onDone?: () => void
  className?: string
}

export function TypedText({ text, speed = 14, instant = false, showCursor = false, onDone, className }: TypedTextProps) {
  const [count, setCount] = useState(instant ? text.length : 0)
  const doneRef = useRef(false)

  const finish = useEffectEvent(() => {
    if (doneRef.current) return
    doneRef.current = true
    onDone?.()
  })

  useEffect(() => {
    if (instant) {
      setCount(text.length)
      finish()
      return
    }
    let i = 0
    const id = window.setInterval(() => {
      i += 1
      setCount(i)
      if (i >= text.length) {
        window.clearInterval(id)
        finish()
      }
    }, speed)
    return () => window.clearInterval(id)
  }, [text, speed, instant])

  const typing = count < text.length

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.slice(0, count)}
        {(showCursor || typing) && (
          <span className="animate-blink ml-0.5 inline-block h-[1em] w-[0.55em] translate-y-[0.15em] bg-lab-cyan" />
        )}
      </span>
    </span>
  )
}
