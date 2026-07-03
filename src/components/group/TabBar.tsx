export type GroupTab = 'attendance' | 'homework'

interface TabBarProps {
  active: GroupTab
  onChange: (tab: GroupTab) => void
}

const TABS: { id: GroupTab; label: string }[] = [
  { id: 'attendance', label: 'Attendance' },
  { id: 'homework', label: 'Homework' },
]

export function TabBar({ active, onChange }: TabBarProps) {
  return (
    <div role="tablist" className="flex border-b border-line px-4">
      {TABS.map((tab) => {
        const isActive = tab.id === active
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`relative px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive ? 'text-ink' : 'text-ink-muted hover:text-ink'
            }`}
          >
            {tab.label}
            {isActive && (
              <span
                aria-hidden="true"
                className="absolute inset-x-0 -bottom-px h-0.5 bg-accent"
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
