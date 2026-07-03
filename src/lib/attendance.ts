import { supabase } from './supabase'
import type { AttendanceRecord, AttendanceStatus, IsoDate, Student } from '@/types'

/** Loads attendance for a set of students on one date. Students with no record
 * simply won't appear in the returned array — the caller treats "absent from
 * this array" as "no value entered yet", never as a default status. */
export async function fetchAttendanceForDate(
  studentIds: string[],
  date: IsoDate
): Promise<AttendanceRecord[]> {
  if (studentIds.length === 0) return []

  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('date', date)
    .in('student_id', studentIds)

  if (error) throw error
  return data as AttendanceRecord[]
}

export async function upsertAttendance(
  studentId: string,
  date: IsoDate,
  status: AttendanceStatus
): Promise<AttendanceRecord> {
  const { data, error } = await supabase
    .from('attendance')
    .upsert({ student_id: studentId, date, status }, { onConflict: 'student_id,date' })
    .select()
    .single()

  if (error) throw error
  return data as AttendanceRecord
}

export interface AbsenceAlert {
  student: Student
  groupName: string
  consecutiveAbsences: number
  lastDates: string[]
}

export async function fetchAbsenceAlerts(): Promise<AbsenceAlert[]> {
  const { data: students, error: studentError } = await supabase
    .from('students')
    .select('*, groups(name)')
    .eq('status', 'active')

  if (studentError) throw studentError
  if (!students || students.length === 0) return []

  const { data: attendance, error: attError } = await supabase
    .from('attendance')
    .select('*')
    .order('date', { ascending: false })

  if (attError) throw attError

  const studentAttendanceMap: Record<string, typeof attendance> = {}
  attendance?.forEach((record: any) => {
    if (!studentAttendanceMap[record.student_id]) {
      studentAttendanceMap[record.student_id] = []
    }
    studentAttendanceMap[record.student_id].push(record)
  })

  const alerts: AbsenceAlert[] = []

  students.forEach((student: any) => {
    const records = studentAttendanceMap[student.id] || []
    const activeRecords = records
      .filter((r: any) => r.status === '+' || r.status === '-')
      .sort((a: any, b: any) => b.date.localeCompare(a.date))

    let consecutiveCount = 0
    const dates: string[] = []

    for (const record of activeRecords) {
      if (record.status === '-') {
        consecutiveCount++
        dates.push(record.date)
      } else {
        break
      }
    }

    if (consecutiveCount >= 2) {
      alerts.push({
        student: student as Student,
        groupName: student.groups?.name || 'Unknown',
        consecutiveAbsences: consecutiveCount,
        lastDates: dates,
      })
    }
  })

  return alerts
}

