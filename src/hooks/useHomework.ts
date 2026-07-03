import { useCallback, useEffect, useState } from 'react'
import { fetchActiveStudentsForGroup } from '@/lib/students'
import { fetchHomeworkForDate, upsertHomework, deleteHomework } from '@/lib/homework'
import { useSaveStatusMap } from './useSaveStatusMap'
import type { IsoDate, Student } from '@/types'

export function useHomework(groupId: string, date: IsoDate) {
  const [students, setStudents] = useState<Student[]>([])
  // undefined = no record (field renders empty); number = saved score, including 0.
  const [scoreMap, setScoreMap] = useState<Record<string, number | undefined>>({})
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
        setScoreMap({})
        return
      }

      const records = await fetchHomeworkForDate(
        roster.map((s) => s.id),
        date
      )
      const map: Record<string, number> = {}
      for (const record of records) map[record.student_id] = record.score
      setScoreMap(map)
    } catch {
      setLoadError('Could not load homework. Check your connection.')
    } finally {
      setLoading(false)
    }
  }, [groupId, date])

  useEffect(() => {
    void load()
  }, [load])

  /** Called on Enter or blur — score is either a validated integer 0-100, or
   * null (field was cleared, meaning "no score entered"). */
  async function saveScore(studentId: string, score: number | null) {
    const previous = scoreMap[studentId]

    // No-op if nothing actually changed (e.g. blurring a field that was never edited).
    if (previous === (score ?? undefined)) return

    setScoreMap((prev) => ({ ...prev, [studentId]: score ?? undefined }))
    setSaveStatus(studentId, 'saving')

    try {
      if (score === null) {
        await deleteHomework(studentId, date)
      } else {
        await upsertHomework(studentId, date, score)
      }
      setSaveStatus(studentId, 'idle')
    } catch {
      setScoreMap((prev) => ({ ...prev, [studentId]: previous }))
      setSaveStatus(studentId, 'error')
    }
  }

  return {
    students,
    scoreMap,
    loading,
    loadError,
    saveScore,
    getSaveStatus,
    reload: load,
  }
}
