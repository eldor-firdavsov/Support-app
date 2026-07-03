import { useEffect, useState, type KeyboardEvent } from 'react'
import { parseScoreInput, sanitizeScoreDraft } from '@/lib/validation'
import type { RowSaveStatus } from '@/hooks/useSaveStatusMap'

interface ScoreInputProps {
  studentId: string
  value: number | undefined
  saveStatus: RowSaveStatus
  onSave: (score: number | null) => void
}

export function ScoreInput({ value, saveStatus, onSave }: ScoreInputProps) {
  // Local draft so typing feels instant; only commits to the save path on Enter/blur.
  const [draft, setDraft] = useState(value === undefined ? '' : String(value))

  // If the underlying value changes from outside (date switch, load, rollback
  // on error), the draft must follow it rather than showing stale text.
  useEffect(() => {
    setDraft(value === undefined ? '' : String(value))
  }, [value])

  function commit() {
    const parsed = parseScoreInput(draft)
    onSave(parsed)
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.currentTarget.blur() // blur triggers commit via onBlur, avoiding duplicate saves
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        aria-label="Homework score, 0 to 100"
        value={draft}
        onChange={(e) => setDraft(sanitizeScoreDraft(e.target.value))}
        onKeyDown={handleKeyDown}
        onBlur={commit}
        className="tabular-nums h-9 w-16 rounded-sm border border-line-strong bg-surface px-2 text-right text-sm text-ink outline-none transition-all focus-visible:border-accent hover:border-accent-soft focus:border-accent"
      />

      {saveStatus === 'error' && (
        <span role="alert" className="text-xs text-absent">
          Not saved
        </span>
      )}
    </div>
  )
}
