export const RELEASE_DELAY_OPTIONS = [
  { value: 60, label: '1 minuto (demo)' },
  { value: 300, label: '5 minutos' },
  { value: 3600, label: '1 hora' },
  { value: 86400, label: '24 horas' },
] as const

export const EMPLOYER_RECLAIM_DELAY_SECONDS = 60 * 60 * 24 * 30

export function calculateReleaseAt(createdAt: string, releaseDelaySeconds: number): Date {
  return new Date(new Date(createdAt).getTime() + releaseDelaySeconds * 1000)
}

export function isReleaseWindowOpen(createdAt: string, releaseDelaySeconds: number): boolean {
  return Date.now() >= calculateReleaseAt(createdAt, releaseDelaySeconds).getTime()
}

export function formatReleaseDelay(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.round(seconds / 60)} min`
  if (seconds < 86400) return `${Math.round(seconds / 3600)} h`
  return `${Math.round(seconds / 86400)} días`
}
