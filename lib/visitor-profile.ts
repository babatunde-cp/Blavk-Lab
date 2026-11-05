export type FieldSource = 'detected' | 'estimated' | 'unavailable' | 'local-only'

export type ProfileField = {
  key: string
  value: string
  source: FieldSource
}

const UNAVAILABLE = 'Not exposed by browser'
const VISIT_KEY = 'blavk:visit-count'
const NAME_KEY = 'blavk:visitor-name'

type UADataBrand = { brand: string; version: string }
type NavigatorWithUAData = Navigator & {
  userAgentData?: { brands?: UADataBrand[]; platform?: string; mobile?: boolean }
}

function detectOS(nav: NavigatorWithUAData): ProfileField {
  const platform = nav.userAgentData?.platform
  if (platform) return { key: 'operating_system', value: platform, source: 'detected' }

  const ua = nav.userAgent
  const rules: [RegExp, string][] = [
    [/iPhone|iPad|iPod/, 'iOS'],
    [/Android/, 'Android'],
    [/CrOS/, 'ChromeOS'],
    [/Windows/, 'Windows'],
    [/Mac OS X|Macintosh/, 'macOS'],
    [/Linux/, 'Linux'],
  ]
  const match = rules.find(([pattern]) => pattern.test(ua))
  return match
    ? { key: 'operating_system', value: match[1], source: 'estimated' }
    : { key: 'operating_system', value: 'Unknown', source: 'unavailable' }
}

function detectBrowser(nav: NavigatorWithUAData): ProfileField {
  const brands = nav.userAgentData?.brands?.filter(
    (b) => !/not.?a.?brand|chromium/i.test(b.brand),
  )
  if (brands && brands.length > 0) {
    const b = brands[0]
    return { key: 'browser', value: `${b.brand} ${b.version}`, source: 'detected' }
  }

  const ua = nav.userAgent
  const rules: [RegExp, string][] = [
    [/Edg\/(\d+)/, 'Edge'],
    [/OPR\/(\d+)/, 'Opera'],
    [/Firefox\/(\d+)/, 'Firefox'],
    [/SamsungBrowser\/(\d+)/, 'Samsung Internet'],
    [/Chrome\/(\d+)/, 'Chrome'],
    [/Version\/(\d+).*Safari/, 'Safari'],
  ]
  for (const [pattern, name] of rules) {
    const m = ua.match(pattern)
    if (m) return { key: 'browser', value: `${name} ${m[1]}`, source: 'estimated' }
  }
  return { key: 'browser', value: 'Unknown', source: 'unavailable' }
}

let cachedVisitNumber: number | null = null

function readVisitNumber(): ProfileField {
  if (cachedVisitNumber !== null) {
    return { key: 'visit_number', value: String(cachedVisitNumber).padStart(2, '0'), source: 'local-only' }
  }
  try {
    const previous = Number.parseInt(window.localStorage.getItem(VISIT_KEY) ?? '0', 10)
    const next = (Number.isFinite(previous) ? previous : 0) + 1
    window.localStorage.setItem(VISIT_KEY, String(next))
    cachedVisitNumber = next
    return { key: 'visit_number', value: String(next).padStart(2, '0'), source: 'local-only' }
  } catch {
    return { key: 'visit_number', value: UNAVAILABLE, source: 'unavailable' }
  }
}

export function formatLocalTime(date = new Date()): string {
  return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export function formatViewport(): string {
  return `${window.innerWidth} × ${window.innerHeight}`
}

export function formatTimestamp(date = new Date()): string {
  const pad = (n: number, len = 2) => String(n).padStart(len, '0')
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${pad(date.getMilliseconds(), 3)}`
}

export function collectVisitorProfile(): ProfileField[] {
  const nav = navigator as NavigatorWithUAData

  const screenRes =
    window.screen?.width && window.screen?.height
      ? { value: `${window.screen.width} × ${window.screen.height}`, source: 'detected' as const }
      : { value: UNAVAILABLE, source: 'unavailable' as const }

  const dpr = window.devicePixelRatio
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')
  const prefersLight = window.matchMedia?.('(prefers-color-scheme: light)')
  const scheme = prefersDark?.matches ? 'dark' : prefersLight?.matches ? 'light' : 'no preference'

  return [
    detectOS(nav),
    detectBrowser(nav),
    { key: 'screen_resolution', ...screenRes },
    dpr
      ? { key: 'display_scale', value: `${Number(dpr.toFixed(2))}x`, source: 'detected' }
      : { key: 'display_scale', value: UNAVAILABLE, source: 'unavailable' },
    { key: 'viewport_size', value: formatViewport(), source: 'detected' },
    nav.language
      ? { key: 'language', value: nav.language, source: 'detected' }
      : { key: 'language', value: UNAVAILABLE, source: 'unavailable' },
    timeZone
      ? { key: 'timezone', value: timeZone, source: 'detected' }
      : { key: 'timezone', value: UNAVAILABLE, source: 'unavailable' },
    { key: 'local_time', value: formatLocalTime(), source: 'detected' },
    { key: 'color_scheme', value: scheme, source: prefersDark ? 'detected' : 'unavailable' },
    readVisitNumber(),
  ]
}

export function sanitizeName(raw: string, maxLength = 32): { ok: true; name: string } | { ok: false; error: string } {
  const name = raw.replace(/\s+/g, ' ').trim()
  if (!name) return { ok: false, error: 'Please enter a name so I know what to call you.' }
  if (name.length > maxLength) return { ok: false, error: `Keep it under ${maxLength} characters.` }
  if (!/^[\p{L}\p{M}\p{N} .'\-]+$/u.test(name)) {
    return { ok: false, error: 'Letters, numbers, spaces, apostrophes, periods and hyphens only.' }
  }
  return { ok: true, name }
}

export function storeSessionName(name: string) {
  try {
    window.sessionStorage.setItem(NAME_KEY, name)
  } catch {}
}

export function readSessionName(): string | null {
  try {
    return window.sessionStorage.getItem(NAME_KEY)
  } catch {
    return null
  }
}
