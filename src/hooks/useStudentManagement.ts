import { useCallback, useEffect, useState } from 'react'
import {
  createStudent,
  deleteStudent,
  fetchAllStudentsForGroup,
  updateStudent,
} from '@/lib/students'
import type { Student } from '@/types'

export function useStudentManagement(groupId: string) {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    try {
      const data = await fetchAllStudentsForGroup(groupId)
      setStudents(data)
    } catch {
      setLoadError('Could not load students. Check your connection.')
    } finally {
      setLoading(false)
    }
  }, [groupId])

  useEffect(() => {
    void load()
  }, [load])

  async function addStudent(fullName: string): Promise<boolean> {
    const trimmed = fullName.trim()
    if (trimmed === '') {
      setActionError('Full name is required.')
      return false
    }
    setActionError(null)
    try {
      const created = await createStudent({ full_name: trimmed, group_id: groupId, status: 'active' })
      setStudents((prev) => [...prev, created].sort((a, b) => a.full_name.localeCompare(b.full_name)))
      return true
    } catch {
      setActionError('Could not add student. Check your connection and try again.')
      return false
    }
  }

  async function editStudent(
    studentId: string,
    changes: { fullName: string; status: string }
  ): Promise<boolean> {
    const trimmed = changes.fullName.trim()
    if (trimmed === '') {
      setActionError('Full name is required.')
      return false
    }
    setActionError(null)
    try {
      const updated = await updateStudent(studentId, { full_name: trimmed, status: changes.status })
      setStudents((prev) =>
        prev
          .map((s) => (s.id === studentId ? updated : s))
          .sort((a, b) => a.full_name.localeCompare(b.full_name))
      )
      return true
    } catch {
      setActionError('Could not save changes. Check your connection and try again.')
      return false
    }
  }


  async function removeStudent(studentId: string): Promise<boolean> {
    setActionError(null)
    try {
      await deleteStudent(studentId)
      setStudents((prev) => prev.filter((s) => s.id !== studentId))
      return true
    } catch {
      setActionError('Could not delete this student. Check your connection and try again.')
      return false
    }
  }

  return {
    students,
    loading,
    loadError,
    actionError,
    clearActionError: () => setActionError(null),
    addStudent,
    editStudent,
    removeStudent,
    reload: load,
  }
}
