'use client'

import { useId, useState, type FormEvent } from 'react'
import { CornerDownLeft } from 'lucide-react'
import { sanitizeName } from '@/lib/visitor-profile'

const MAX_NAME_LENGTH = 32

type NamePromptProps = {
  onSubmit: (name: string) => void
}

export function NamePrompt({ onSubmit }: NamePromptProps) {
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)
  const inputId = useId()
  const errorId = useId()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = sanitizeName(value, MAX_NAME_LENGTH)
    if (!result.ok) {
      setError(result.error)
      return
    }
    setError(null)
    onSubmit(result.name)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="animate-fade-up mt-6 space-y-3">
      <label htmlFor={inputId} className="block font-sans text-base text-foreground sm:text-lg">
        Before we get into the data, what should I call you?
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <span aria-hidden="true" className="absolute top-1/2 left-3 -translate-y-1/2 font-mono text-lab-cyan">
            {'>'}
          </span>
          <input
            id={inputId}
            type="text"
            autoComplete="given-name"
            autoFocus
            maxLength={MAX_NAME_LENGTH}
            placeholder="Enter your name..."
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              if (error) setError(null)
            }}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className="h-12 w-full rounded-md border border-input bg-background/70 pr-3 pl-8 font-mono text-base text-foreground placeholder:text-muted-foreground/70 outline-none transition-[border-color,box-shadow] focus-visible:border-lab-cyan focus-visible:ring-2 focus-visible:ring-lab-cyan/40 aria-invalid:border-destructive"
          />
        </div>
        <button
          type="submit"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-lab-cyan/50 bg-lab-cyan/10 px-5 font-mono text-sm font-medium tracking-widest text-lab-cyan transition-colors hover:bg-lab-cyan/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lab-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          ENTER
          <CornerDownLeft className="size-4" aria-hidden="true" />
        </button>
      </div>
      <p id={errorId} role="alert" className="min-h-5 font-mono text-xs text-destructive">
        {error}
      </p>
      <p className="font-mono text-xs text-muted-foreground">
        Your name stays in this browser tab only. It is never sent to a server.
      </p>
    </form>
  )
}
