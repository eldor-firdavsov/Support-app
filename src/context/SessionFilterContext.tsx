import { createContext, useContext, useState, type ReactNode } from 'react'
import { currentMonthIso, todayIso } from '@/lib/dates'

const MONTH_KEY = 'support-teacher:selected-month'
const DATE_KEY = 'support-teacher:selected-date'

interface SessionFilterContextValue {
  month: string // 'YYYY-MM'
  date: string // 'YYYY-MM-DD'
  setMonth: (month: string) => void
  setDate: (date: string) => void
}

const SessionFilterContext = createContext<SessionFilterContextValue | undefined>(undefined)

function readInitial(key: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback
  return window.localStorage.getItem(key) ?? fallback
}

export function SessionFilterProvider({ children }: { children: ReactNode }) {
  const [month, setMonthState] = useState(() => readInitial(MONTH_KEY, currentMonthIso()))
  const [date, setDateState] = useState(() => readInitial(DATE_KEY, todayIso()))

  function setMonth(next: string) {
    setMonthState(next)
    window.localStorage.setItem(MONTH_KEY, next)
  }

  function setDate(next: string) {
    setDateState(next)
    window.localStorage.setItem(DATE_KEY, next)
  }

  return (
    <SessionFilterContext.Provider value={{ month, date, setMonth, setDate }}>
      {children}
    </SessionFilterContext.Provider>
  )
}

export function useSessionFilter() {
  const ctx = useContext(SessionFilterContext)
  if (!ctx) throw new Error('useSessionFilter must be used within SessionFilterProvider')
  return ctx
}
