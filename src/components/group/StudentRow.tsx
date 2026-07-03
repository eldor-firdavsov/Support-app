import type { ReactNode } from 'react'

interface StudentRowProps {
  name: string
  children: ReactNode
  focused?: boolean
  rowIndex?: number
}

export function StudentRow({ name, children, focused, rowIndex }: StudentRowProps) {
  return (
    <div
      data-row-index={rowIndex}
      className={`ledger-row flex items-center justify-between gap-3 px-4 py-3.5 transition-colors ${
        focused
          ? 'bg-accent/8 border-l-2 border-accent outline-none ring-0'
          : 'hover:bg-accent-soft/20 border-l-2 border-transparent'
      }`}
    >
      {focused && (
        <span className="mr-1 text-accent text-xs font-bold select-none">›</span>
      )}
      <span className={`text-[15px] font-medium flex-1 ${focused ? 'text-accent' : 'text-ink'}`}>{name}</span>
      {children}
    </div>
  )
}


