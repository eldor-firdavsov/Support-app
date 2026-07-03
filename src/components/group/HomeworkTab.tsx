import { useHomework } from '@/hooks/useHomework'
import { StudentRow } from './StudentRow'
import { ScoreInput } from './ScoreInput'
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

  if (loading) {
    return <p className="px-4 py-6 text-sm text-ink-muted">Loading homework…</p>
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
          Try again
        </button>
      </div>
    )
  }

  if (students.length === 0) {
    return (
      <p className="px-4 py-6 text-sm text-ink-muted">
        No active students in this group yet. Add students from the group menu.
      </p>
    )
  }

  return (
    <div>
      <div className="ledger-row flex items-center justify-between px-4 py-2 text-xs font-medium text-ink-muted">
        <span>Student</span>
        <span>Score</span>
      </div>
      {students.map((student) => (
        <StudentRow key={student.id} name={student.full_name}>
          <ScoreInput
            studentId={student.id}
            value={scoreMap[student.id]}
            saveStatus={getSaveStatus(student.id)}
            onSave={(score) => void saveScore(student.id, score)}
          />
        </StudentRow>
      ))}
    </div>
  )
}
