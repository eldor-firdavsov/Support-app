import { useRef, useState, useEffect } from 'react'
import { useHomework } from '@/hooks/useHomework'
import { StudentRow } from './StudentRow'
import { ScoreInput, type ScoreInputHandle } from './ScoreInput'
import type { IsoDate } from '@/types'

interface HomeworkTabProps {
  groupId: string
  date: IsoDate
}

export function HomeworkTab({ groupId, date }: HomeworkTabProps) {
  const { students, scoreMap, loading, loadError, saveScore, getSaveStatus, reload } = useHomework(
    groupId,
    date
  )

  const [focusedIndex, setFocusedIndex] = useState(0)
  const inputRefs = useRef<(ScoreInputHandle | null)[]>([])
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])

  // Focus the input of the focused row
  useEffect(() => {
    inputRefs.current[focusedIndex]?.focus()
    rowRefs.current[focusedIndex]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [focusedIndex])

  // Reset focus when students or date changes
  useEffect(() => {
    setFocusedIndex(0)
  }, [groupId, date])

  function goNext() {
    setFocusedIndex((i) => Math.min(i + 1, students.length - 1))
  }

  function goPrev() {
    setFocusedIndex((i) => Math.max(i - 1, 0))
  }

  if (loading) {
    return <p className="px-4 py-6 text-sm text-ink-muted">Uy vazifasi yuklanmoqda…</p>
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
        <span><kbd className="bg-line px-1 py-0.5 rounded text-[9px]">Enter</kbd> Saqlash va keyingisi</span>
        <span>Raqam kiriting va Enter bosing</span>
      </div>

      <div className="ledger-row flex items-center justify-between px-4 py-2 text-xs font-medium text-ink-muted">
        <span>O'quvchi</span>
        <span>Baho</span>
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
            <ScoreInput
              ref={(el) => { inputRefs.current[index] = el }}
              studentId={student.id}
              value={scoreMap[student.id]}
              saveStatus={getSaveStatus(student.id)}
              onSave={(score) => void saveScore(student.id, score)}
              onNext={goNext}
              onPrev={goPrev}
            />
          </StudentRow>
        </div>
      ))}
    </div>
  )
}
