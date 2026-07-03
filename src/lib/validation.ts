/** Returns a valid integer 0-100, or null if the raw input is empty / invalid.
 * "Invalid" (letters, symbols, decimals, out of range) is treated the same as
 * "reject the keystroke" at the input layer — this function is the single
 * source of truth both the input's onChange filter and the save path use. */
export function parseScoreInput(raw: string): number | null {
  const trimmed = raw.trim()
  if (trimmed === '') return null
  if (!/^\d+$/.test(trimmed)) return null

  const value = Number(trimmed)
  if (!Number.isInteger(value)) return null
  if (value < 0 || value > 100) return null
  return value
}

/** Filters keystrokes as the teacher types, so invalid characters never appear
 * in the field at all rather than being rejected after the fact. Allows an
 * in-progress empty string and partial numbers (e.g. "10" while typing "100"). */
export function sanitizeScoreDraft(raw: string): string {
  const digitsOnly = raw.replace(/[^\d]/g, '')
  if (digitsOnly === '') return ''

  // Prevent typing past 3 digits or a value that can never become valid (e.g. "999").
  const capped = digitsOnly.slice(0, 3)
  const numeric = Number(capped)
  if (numeric > 100) return '100'
  return String(numeric)
}
