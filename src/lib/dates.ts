import type { IsoDate } from '@/types'

/** Today's date as 'YYYY-MM-DD', in the browser's local time (single-timezone deployment, no conversion needed). */
export function todayIso(): IsoDate {
  const d = new Date()
  return toIso(d)
}

export function toIso(d: Date): IsoDate {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** 'YYYY-MM' for the current month. */
export function currentMonthIso(): string {
  return todayIso().slice(0, 7)
}

/** All valid 'YYYY-MM-DD' days in a given 'YYYY-MM' month, excluding any day after today or before 2026-07-01. */
export function daysInMonthUpToToday(monthIso: string): IsoDate[] {
  const [yearStr, monthStr] = monthIso.split('-')
  const year = Number(yearStr)
  const month = Number(monthStr) // 1-12
  const daysInMonth = new Date(year, month, 0).getDate()
  const today = todayIso()

  const days: IsoDate[] = []
  for (let day = 1; day <= daysInMonth; day++) {
    const iso = `${yearStr}-${monthStr}-${String(day).padStart(2, '0')}`
    if (iso >= '2026-07-01' && iso <= today) {
      days.push(iso)
    }
  }
  return days
}

/** Months starting from '2026-07' up to current month, most recent first. */
export function recentMonths(_count?: number): string[] {
  const months: string[] = []
  const now = new Date()
  const start = new Date(2026, 6, 1) // July 2026

  let current = new Date(now.getFullYear(), now.getMonth(), 1)
  while (current >= start) {
    months.push(`${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`)
    current.setMonth(current.getMonth() - 1)
  }
  return months
}

export function formatMonthLabel(monthIso: string): string {
  const [year, month] = monthIso.split('-').map(Number)
  const d = new Date(year, month - 1, 1)
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export function formatDateLabel(dateIso: IsoDate): string {
  const [year, month, day] = dateIso.split('-').map(Number)
  const d = new Date(year, month - 1, day)
  return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })
}
