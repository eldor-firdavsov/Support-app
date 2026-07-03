export type EntityStatus = 'active' | 'inactive'

export interface Group {
  id: string
  name: string
  status: EntityStatus
  studentCount?: number
}


export interface Student {
  id: string
  full_name: string
  group_id: string
  status: string
  student_number?: string
  contact?: string
  parent_contact?: string
}


export type AttendanceStatus = '+' | '-' | 'n/a'

export interface AttendanceRecord {
  id: string
  student_id: string
  date: string // 'YYYY-MM-DD'
  status: AttendanceStatus
}

export interface HomeworkRecord {
  id: string
  student_id: string
  date: string // 'YYYY-MM-DD'
  score: number // 0-100 integer
}

/** ISO date string 'YYYY-MM-DD', always local (Asia/Tashkent), never a Date with a time component. */
export type IsoDate = string
