type ContactIconName = 'github' | 'linkedin' | 'x' | 'gmail'

const contactLinks: { name: ContactIconName; label: string; href: string; external: boolean; color: string }[] = [
  { name: 'github', label: 'GitHub profile', href: 'https://github.com/babatunde-cp', external: true, color: 'text-foreground' },
  { name: 'linkedin', label: 'LinkedIn profile', href: 'https://www.linkedin.com/in/babatunde-kareem-822533363/', external: true, color: 'text-[#0a66c2]' },
  { name: 'x', label: 'X profile', href: 'https://x.com/blavklyst', external: true, color: 'text-foreground' },
  { name: 'gmail', label: 'Email Babatunde Kareem', href: 'mailto:babatundekareem4u@gmail.com', external: false, color: 'text-[#ea4335]' },
]

function ContactIcon({ name }: { name: ContactIconName }) {
  if (name === 'github') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-7">
        <path d="M12 .75a11.5 11.5 0 0 0-3.64 22.41c.58.11.79-.25.79-.56v-2.16c-3.2.71-3.88-1.39-3.88-1.39-.52-1.35-1.28-1.71-1.28-1.71-1.04-.73.08-.72.08-.72 1.15.08 1.76 1.2 1.76 1.2 1.02 1.79 2.68 1.27 3.34.97.1-.75.4-1.27.73-1.56-2.56-.3-5.25-1.31-5.25-5.82 0-1.29.45-2.34 1.19-3.17-.12-.3-.52-1.5.11-3.12 0 0 .97-.32 3.19 1.21a10.9 10.9 0 0 1 5.81 0c2.21-1.53 3.18-1.21 3.18-1.21.63 1.62.23 2.82.12 3.12.74.83 1.18 1.88 1.18 3.17 0 4.52-2.69 5.51-5.26 5.81.41.36.78 1.07.78 2.16v3.2c0 .31.21.68.8.56A11.5 11.5 0 0 0 12 .75Z" />
      </svg>
    )
  }

  if (name === 'linkedin') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-7">
        <path d="M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96c0 .84.69 1.52 1.55 1.52h16.9c.86 0 1.55-.68 1.55-1.52V3.52c0-.84-.69-1.52-1.55-1.52ZM7.93 18.45H4.96V9h2.97v9.45ZM6.45 7.71a1.72 1.72 0 1 1 0-3.44 1.72 1.72 0 0 1 0 3.44Zm12 10.74h-2.97v-4.6c0-1.1-.02-2.51-1.53-2.51-1.53 0-1.76 1.19-1.76 2.43v4.68H9.22V9h2.85v1.29h.04c.4-.75 1.36-1.53 2.8-1.53 3 0 3.55 1.97 3.55 4.53v5.16Z" />
      </svg>
    )
  }

  if (name === 'x') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-6">
        <path d="M18.9 1.15h3.68L14.54 10.4 24 22.98h-7.4l-5.8-7.58-6.64 7.58H.48l8.59-9.83L0 1.15h7.59l5.25 6.94 6.06-6.94Zm-1.29 19.61h2.04L6.48 3.25H4.29l13.32 17.51Z" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-7">
      <path d="M3.25 6.1v11.8c0 .64.51 1.15 1.15 1.15h15.2c.64 0 1.15-.51 1.15-1.15V6.1" stroke="#4285F4" strokeWidth="2.2" strokeLinecap="round" />
      <path d="m3.65 5.55 7.66 5.86a1.15 1.15 0 0 0 1.38 0l7.66-5.86" stroke="#EA4335" strokeWidth="2.2" strokeLinecap="round" />
      <path d="m3.4 18.1 5-5.45" stroke="#34A853" strokeWidth="2.2" strokeLinecap="round" />
      <path d="m20.6 18.1-5-5.45" stroke="#FBBC04" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

export function ContactSection() {
  return (
    <section id="contacts" className="relative scroll-mt-20 border-t border-rose-400/25 px-4 py-16 sm:px-8 sm:py-24" aria-labelledby="contacts-heading">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_10%_40%,oklch(0.58_0.17_350_/_0.08),transparent_42%),radial-gradient(ellipse_at_90%_85%,oklch(0.55_0.14_175_/_0.08),transparent_40%)]" />
      <div className="relative z-10 mx-auto max-w-4xl">
        <header>
          <p className="lab-tone tone-rose lab-tone-label font-mono text-[10px] tracking-[0.2em]">CONTACTS <span className="text-muted-foreground">// SAY HI</span></p>
          <h2 id="contacts-heading" className="mt-3 font-mono text-2xl font-semibold tracking-[0.08em] text-foreground sm:text-3xl">LET&apos;S CONNECT.</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">Hit me up. Let&apos;s get your data working.</p>
        </header>

        <ul className="mt-7 flex items-center justify-center gap-3" aria-label="Contact links">
          {contactLinks.map(({ name, label, href, external, color }) => (
            <li key={name}>
              <a
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                aria-label={label}
                title={label}
                className={`group inline-flex size-12 items-center justify-center rounded-lg ${color} transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lab-cyan focus-visible:ring-offset-4 focus-visible:ring-offset-background`}
              >
                <ContactIcon name={name} />
                <span className="sr-only">{label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
