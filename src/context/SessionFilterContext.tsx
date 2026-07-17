import { createContext, useContext, useState, type ReactNode } from 'react'
import { todayIso } from '@/lib/dates'

const MONTH_KEY = 'support-teacher:selected-month'
const DATE_KEY = 'support-teacher:selected-date'

interface SessionFilterContextValue {
  month: string // 'YYYY-MM'
  date: string // 'YYYY-MM-DD'
  setMonth: (month: string) => void
  setDate: (date: string) => void
}

const SessionFilterContext = createContext<SessionFilterContextValue | undefined>(undefined)

function readFromStorage(key: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback
  return window.localStorage.getItem(key) ?? fallback
}

/**
 * Har kuni ilova ochilganda bugungi sanani avtomatik ko'rsatadi.
 * Agar LocalStorage da saqlangan sana bugundan farqli bo'lsa (kechagi yoki
 * kelajak), bugungi sana va bugungi oy qaytariladi.
 */
function resolveInitial(): { date: string; month: string } {
  const today = todayIso()
  const todayMonth = today.slice(0, 7)

  const savedDate = readFromStorage(DATE_KEY, today)
  const savedMonth = readFromStorage(MONTH_KEY, todayMonth)

  // Agar saqlangan sana bugundan farqli bo'lsa → bugungi sana va oyni qaytaramiz
  if (savedDate !== today) {
    return { date: today, month: todayMonth }
  }

  return { date: savedDate, month: savedMonth }
}

export function SessionFilterProvider({ children }: { children: ReactNode }) {
  const initial = resolveInitial()
  const [month, setMonthState] = useState(initial.month)
  const [date, setDateState] = useState(initial.date)

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
