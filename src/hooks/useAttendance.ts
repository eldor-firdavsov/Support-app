import { useCallback, useEffect, useState } from 'react'
import { fetchActiveStudentsForGroup } from '@/lib/students'
import { fetchAttendanceForDate, upsertAttendance } from '@/lib/attendance'
import { useSaveStatusMap } from './useSaveStatusMap'
import type { AttendanceStatus, IsoDate, Student } from '@/types'

export function useAttendance(groupId: string, date: IsoDate) {
  const [students, setStudents] = useState<Student[]>([])
  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceStatus>>({})
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const { getStatus: getSaveStatus, setStatus: setSaveStatus } = useSaveStatusMap()

  const load = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    try {
      const roster = await fetchActiveStudentsForGroup(groupId)
      setStudents(roster)

      if (roster.length === 0) {
        setAttendanceMap({})
        return
      }

      const records = await fetchAttendanceForDate(
        roster.map((s) => s.id),
        date
      )
      const map: Record<string, AttendanceStatus> = {}
      for (const record of records) map[record.student_id] = record.status
      setAttendanceMap(map)
    } catch {
      setLoadError('Could not load attendance. Check your connection.')
    } finally {
      setLoading(false)
    }
  }, [groupId, date])

  useEffect(() => {
    void load()
  }, [load])

  async function setAttendance(studentId: string, status: AttendanceStatus) {
    // No-op if re-tapping the already-selected option — nothing changed, nothing to save.
    if (attendanceMap[studentId] === status) return

    const previous = attendanceMap[studentId]

    // Optimistic update: the row reflects the new value immediately.
    setAttendanceMap((prev) => ({ ...prev, [studentId]: status }))
    setSaveStatus(studentId, 'saving')

    try {
      await upsertAttendance(studentId, date, status)
      setSaveStatus(studentId, 'idle')
    } catch {
      // Roll back so the UI never shows a value that isn't actually saved.
      setAttendanceMap((prev) => {
        const next = { ...prev }
        if (previous) next[studentId] = previous
        else delete next[studentId]
        return next
      })
      setSaveStatus(studentId, 'error')
    }
  }

  async function retry(studentId: string, status: AttendanceStatus) {
    await setAttendance(studentId, status)
  }

  return {
    students,
    attendanceMap,
    loading,
    loadError,
    setAttendance,
    retry,
    getSaveStatus,
    reload: load,
  }
}
