import { daysInMonthUpToToday, formatDateLabel } from '@/lib/dates'

interface DateSelectorProps {
  month: string
  value: string
  onChange: (date: string) => void
}

export function DateSelector({ month, value, onChange }: DateSelectorProps) {
  const days = daysInMonthUpToToday(month)

  return (
    <label className="flex items-center gap-1.5 text-sm">
      <span className="sr-only">Date</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={days.length === 0}
        className="cursor-pointer rounded-sm border border-line bg-surface px-2 py-1.5 font-medium text-ink outline-none focus-visible:border-accent disabled:opacity-50"
      >
        {days.length === 0 && <option value="">No days yet</option>}
        {days.map((d) => (
          <option key={d} value={d}>
            {formatDateLabel(d)}
          </option>
        ))}
      </select>
    </label>
  )
}
