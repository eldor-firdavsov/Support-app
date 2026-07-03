import { useAttendance } from '@/hooks/useAttendance'
import { StudentRow } from './StudentRow'
import { AttendanceToggle } from './AttendanceToggle'
import type { IsoDate } from '@/types'
import { useEffect, useState, useRef } from 'react'

interface AttendanceTabProps {
  groupId: string
  date: IsoDate
}

export function AttendanceTab({ groupId, date }: AttendanceTabProps) {
  const { students, attendanceMap, loading, loadError, setAttendance, getSaveStatus, reload } =
    useAttendance(groupId, date)

  const [focusedIndex, setFocusedIndex] = useState(0)
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])

  // Scroll focused row into view
  useEffect(() => {
    rowRefs.current[focusedIndex]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [focusedIndex])

  // Reset focus when students change (date/group switch)
  useEffect(() => {
    setFocusedIndex(0)
  }, [groupId, date])

  useEffect(() => {
    if (students.length === 0) return

    function handleKeyDown(e: KeyboardEvent) {
      // Don't intercept when typing in a real input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) return

      const student = students[focusedIndex]
      if (!student) return

      switch (e.key) {
        case 'ArrowDown':
        case 'Tab':
          e.preventDefault()
          setFocusedIndex((i) => Math.min(i + 1, students.length - 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setFocusedIndex((i) => Math.max(i - 1, 0))
          break
        case '+':
        case '1':
          e.preventDefault()
          void setAttendance(student.id, '+')
          setFocusedIndex((i) => Math.min(i + 1, students.length - 1))
          break
        case '-':
        case '2':
          e.preventDefault()
          void setAttendance(student.id, '-')
          setFocusedIndex((i) => Math.min(i + 1, students.length - 1))
          break
        case 'n':
        case 'N':
        case '3':
          e.preventDefault()
          void setAttendance(student.id, 'n/a')
          setFocusedIndex((i) => Math.min(i + 1, students.length - 1))
          break
        case 'Enter':
          e.preventDefault()
          setFocusedIndex((i) => Math.min(i + 1, students.length - 1))
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [students, focusedIndex, setAttendance])

  if (loading) {
    return <p className="px-4 py-6 text-sm text-ink-muted">Davomat yuklanmoqda…</p>
  }

  if (loadError) {
    return (
      <div className="px-4 py-6">
        <p role="alert" className="mb-3 text-sm text-absent">
          {loadError}
        </p>
        <button
          type="button"
          onClick={() => void reload()}
          className="text-sm text-accent underline underline-offset-2"
        >
          Qayta urinib ko'ring
        </button>
      </div>
    )
  }

  if (students.length === 0) {
    return (
      <p className="px-4 py-6 text-sm text-ink-muted">
        Bu guruhda hali faol o'quvchilar yo'q. Guruh menyusidan o'quvchilar qo'shing.
      </p>
    )
  }

  return (
    <div>
      {/* Keyboard hint bar */}
      <div className="flex items-center gap-4 px-4 py-2 bg-accent-soft/30 border-b border-line text-[10px] text-ink-muted font-mono">
        <span><kbd className="bg-line px-1 py-0.5 rounded text-[9px]">↑↓</kbd> Ko'chish</span>
        <span><kbd className="bg-line px-1 py-0.5 rounded text-[9px]">+</kbd> yoki <kbd className="bg-line px-1 py-0.5 rounded text-[9px]">1</kbd> Keldi</span>
        <span><kbd className="bg-line px-1 py-0.5 rounded text-[9px]">-</kbd> yoki <kbd className="bg-line px-1 py-0.5 rounded text-[9px]">2</kbd> Kelmadi</span>
        <span><kbd className="bg-line px-1 py-0.5 rounded text-[9px]">N</kbd> yoki <kbd className="bg-line px-1 py-0.5 rounded text-[9px]">3</kbd> Sababli</span>
      </div>

      {students.map((student, index) => (
        <div
          key={student.id}
          ref={(el) => { rowRefs.current[index] = el }}
          onClick={() => setFocusedIndex(index)}
        >
          <StudentRow
            name={student.full_name}
            focused={focusedIndex === index}
            rowIndex={index}
          >
            <AttendanceToggle
              value={attendanceMap[student.id]}
              saveStatus={getSaveStatus(student.id)}
              onChange={(status) => void setAttendance(student.id, status)}
            />
          </StudentRow>
        </div>
      ))}
    </div>
  )
}
