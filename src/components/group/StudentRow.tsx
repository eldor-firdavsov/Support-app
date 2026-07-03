import type { ReactNode } from 'react'

interface StudentRowProps {
  name: string
  children: ReactNode
}

export function StudentRow({ name, children }: StudentRowProps) {
  return (
    <div className="ledger-row flex items-center justify-between gap-3 px-4 py-3.5 hover:bg-accent-soft/20 transition-colors">
      <span className="text-[15px] font-medium text-ink">{name}</span>
      {children}
    </div>
  )
}

