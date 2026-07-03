import { useAttendance } from '@/hooks/useAttendance'
import { StudentRow } from './StudentRow'
import { AttendanceToggle } from './AttendanceToggle'
import type { IsoDate } from '@/types'

interface AttendanceTabProps {
  groupId: string
  date: IsoDate
}

export function AttendanceTab({ groupId, date }: AttendanceTabProps) {
  const { students, attendanceMap, loading, loadError, setAttendance, getSaveStatus, reload } =
    useAttendance(groupId, date)

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
      {students.map((student) => (
        <StudentRow key={student.id} name={student.full_name}>
          <AttendanceToggle
            value={attendanceMap[student.id]}
            saveStatus={getSaveStatus(student.id)}
            onChange={(status) => void setAttendance(student.id, status)}
          />
        </StudentRow>
      ))}
    </div>
  )
}
