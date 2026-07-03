import { supabase } from './supabase'
import type { Student } from '@/types'

export async function fetchActiveStudentsForGroup(groupId: string): Promise<Student[]> {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('group_id', groupId)
    .eq('status', 'active')
    .order('full_name')

  if (error) throw error
  return data as Student[]
}

export async function fetchAllStudentsForGroup(groupId: string): Promise<Student[]> {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('group_id', groupId)
    .order('full_name')

  if (error) throw error
  return data as Student[]
}

export async function fetchAllStudents(): Promise<(Student & { groups: { name: string } | null })[]> {
  const { data, error } = await supabase
    .from('students')
    .select('*, groups(name)')
    .order('full_name')

  if (error) throw error
  return data as (Student & { groups: { name: string } | null })[]
}

export async function createStudent(
  student: Partial<Omit<Student, 'id'>> & { full_name: string; group_id: string }
): Promise<Student> {
  const { data, error } = await supabase
    .from('students')
    .insert(student)
    .select()
    .single()

  if (error) throw error
  return data as Student
}

export async function updateStudent(
  studentId: string,
  changes: Partial<Omit<Student, 'id'>>
): Promise<Student> {
  const { data, error } = await supabase
    .from('students')
    .update(changes)
    .eq('id', studentId)
    .select()
    .single()

  if (error) throw error
  return data as Student
}

export async function deleteStudent(studentId: string): Promise<void> {
  const { error } = await supabase.from('students').delete().eq('id', studentId)
  if (error) throw error
}

