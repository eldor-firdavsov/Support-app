import type { AttendanceStatus } from '@/types'
import type { RowSaveStatus } from '@/hooks/useSaveStatusMap'

interface AttendanceToggleProps {
  value: AttendanceStatus | undefined
  saveStatus: RowSaveStatus
  onChange: (status: AttendanceStatus) => void
}

const OPTIONS: { id: AttendanceStatus; label: string; colorVar: string }[] = [
  { id: '+', label: '+', colorVar: 'var(--color-present)' },
  { id: '-', label: '-', colorVar: 'var(--color-absent)' },
  { id: 'n/a', label: 'n/a', colorVar: 'var(--color-reason)' },
]

export function AttendanceToggle({ value, saveStatus, onChange }: AttendanceToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <div role="radiogroup" className="flex gap-1.5">
        {OPTIONS.map((opt) => {
          const isSelected = value === opt.id
          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={optionFullLabel(opt.id)}
              onClick={() => onChange(opt.id)}
              className="flex h-9 w-9 items-center justify-center rounded-sm border text-sm font-semibold transition-all cursor-pointer hover:scale-105 active:scale-95"
              style={{
                borderColor: isSelected ? opt.colorVar : 'var(--color-line-strong)',
                backgroundColor: isSelected ? opt.colorVar : 'transparent',
                color: isSelected ? 'var(--color-accent-ink)' : 'var(--color-ink-muted)',
              }}
            >

              {opt.label}
            </button>
          )
        })}
      </div>

      {saveStatus === 'error' && (
        <span role="alert" className="text-xs text-absent">
          Not saved — tap to retry
        </span>
      )}
    </div>
  )
}

function optionFullLabel(id: AttendanceStatus): string {
  switch (id) {
    case '+':
      return 'Present'
    case '-':
      return 'Absent'
    case 'n/a':
      return 'Reason'
  }
}
