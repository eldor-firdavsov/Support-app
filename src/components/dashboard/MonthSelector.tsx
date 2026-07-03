import { formatMonthLabel, recentMonths } from '@/lib/dates'

interface MonthSelectorProps {
  value: string
  onChange: (month: string) => void
}

export function MonthSelector({ value, onChange }: MonthSelectorProps) {
  const months = recentMonths(12)

  return (
    <label className="flex items-center gap-1.5 text-sm">
      <span className="sr-only">Month</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="cursor-pointer rounded-sm border border-line bg-surface px-2 py-1.5 font-medium text-ink outline-none focus-visible:border-accent"
      >
        {months.map((m) => (
          <option key={m} value={m}>
            {formatMonthLabel(m)}
          </option>
        ))}
      </select>
    </label>
  )
}
