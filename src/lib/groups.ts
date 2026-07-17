import { supabase } from './supabase'
import type { Group, Student } from '@/types'

export async function fetchActiveGroups(): Promise<Group[]> {
  // Fetch active groups
  const { data: groupsData, error: groupsError } = await supabase
    .from('groups')
    .select('*')
    .eq('status', 'active')

  if (groupsError) throw groupsError

  // Fetch active students
  const { data: studentsData, error: studentsError } = await supabase
    .from('students')
    .select('*')
    .eq('status', 'active')

  if (studentsError) throw studentsError

  const groups = groupsData as Group[]
  const students = studentsData as Student[]

  // Set of group IDs with at least one active student
  const activeGroupIds = new Set(students.map((s) => s.group_id))

  // Count active students per group
  const studentCounts: Record<string, number> = {}
  students.forEach((s) => {
    studentCounts[s.group_id] = (studentCounts[s.group_id] || 0) + 1
  })

  // Filter for A, B, and R groups only, which have at least one active student
  const filtered = groups.filter(
    (g) => (g.name.startsWith('A') || g.name.startsWith('B') || g.name.startsWith('R')) && activeGroupIds.has(g.id)
  )

  const mapped = filtered.map((g) => ({
    ...g,
    studentCount: studentCounts[g.id] || 0,
  }))

  return mapped.sort((a, b) => {
    const aPrefix = a.name.charAt(0)
    const bPrefix = b.name.charAt(0)
    if (aPrefix !== bPrefix) {
      return aPrefix.localeCompare(bPrefix)
    }
    const aNum = parseInt(a.name.substring(1), 10) || 0
    const bNum = parseInt(b.name.substring(1), 10) || 0
    return aNum - bNum
  })

}

export async function fetchGroupById(groupId: string): Promise<Group | null> {
  const { data, error } = await supabase.from('groups').select('*').eq('id', groupId).maybeSingle()

  if (error) throw error
  return data as Group | null
}

export async function createGroup(name: string): Promise<Group> {
  const { data, error } = await supabase
    .from('groups')
    .insert({ name })
    .select()
    .single()

  if (error) throw error
  return data as Group
}

export async function fetchAllGroups(): Promise<Group[]> {
  const { data, error } = await supabase
    .from('groups')
    .select('*')
    .eq('status', 'active')

  if (error) throw error
  
  return (data as Group[]).sort((a, b) => {
    const aPrefix = a.name.charAt(0)
    const bPrefix = b.name.charAt(0)
    if (aPrefix !== bPrefix) {
      return aPrefix.localeCompare(bPrefix)
    }
    const aNum = parseInt(a.name.substring(1), 10) || 0
    const bNum = parseInt(b.name.substring(1), 10) || 0
    return aNum - bNum
  })
}



