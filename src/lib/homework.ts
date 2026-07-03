import { supabase } from './supabase'
import type { HomeworkRecord, IsoDate } from '@/types'

export async function fetchHomeworkForDate(
  studentIds: string[],
  date: IsoDate
): Promise<HomeworkRecord[]> {
  if (studentIds.length === 0) return []

  const { data, error } = await supabase
    .from('homework')
    .select('*')
    .eq('date', date)
    .in('student_id', studentIds)

  if (error) throw error
  return data as HomeworkRecord[]
}

export async function upsertHomework(
  studentId: string,
  date: IsoDate,
  score: number
): Promise<HomeworkRecord> {
  const { data, error } = await supabase
    .from('homework')
    .upsert({ student_id: studentId, date, score }, { onConflict: 'student_id,date' })
    .select()
    .single()

  if (error) throw error
  return data as HomeworkRecord
}

/** Clearing a score field means "not graded yet", not "graded as 0" — so a
 * cleared field deletes the row rather than writing a 0. */
export async function deleteHomework(studentId: string, date: IsoDate): Promise<void> {
  const { error } = await supabase
    .from('homework')
    .delete()
    .eq('student_id', studentId)
    .eq('date', date)

  if (error) throw error
}
