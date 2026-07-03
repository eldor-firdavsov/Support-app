import { forwardRef, useEffect, useImperativeHandle, useRef, useState, type KeyboardEvent } from 'react'
import { parseScoreInput, sanitizeScoreDraft } from '@/lib/validation'
import type { RowSaveStatus } from '@/hooks/useSaveStatusMap'

interface ScoreInputProps {
  studentId: string
  value: number | undefined
  saveStatus: RowSaveStatus
  onSave: (score: number | null) => void
  onNext?: () => void
  onPrev?: () => void
}

export interface ScoreInputHandle {
  focus: () => void
}

export const ScoreInput = forwardRef<ScoreInputHandle, ScoreInputProps>(
  function ScoreInput({ value, saveStatus, onSave, onNext, onPrev }, ref) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [draft, setDraft] = useState(value === undefined ? '' : String(value))

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
    }))

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
        e.preventDefault()
        commit()
        onNext?.()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        commit()
        onNext?.()
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        commit()
        onPrev?.()
      }
    }

    return (
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          aria-label="Uy vazifasi bahosi, 0 dan 100 gacha"
          value={draft}
          onChange={(e) => setDraft(sanitizeScoreDraft(e.target.value))}
          onKeyDown={handleKeyDown}
          onBlur={commit}
          className="tabular-nums h-9 w-16 rounded-sm border border-line-strong bg-surface px-2 text-right text-sm text-ink outline-none transition-all focus-visible:border-accent hover:border-accent-soft focus:border-accent"
        />

        {saveStatus === 'error' && (
          <span role="alert" className="text-xs text-absent">
            Saqlanmadi
          </span>
        )}
      </div>
    )
  }
)
