import type { Group } from '@/types'

export interface TimetableSlot {
  groupName: string
  day: string
  time: string // e.g. "10:00"
  room: string
}

export const TIMETABLE: TimetableSlot[] = [
  // Monday
  { groupName: 'B9', day: 'Monday', time: '10:00', room: 'Computer Room' },
  { groupName: 'A6', day: 'Monday', time: '10:00', room: 'IT 1' },
  { groupName: 'A16', day: 'Monday', time: '14:00', room: 'Computer Room' },
  { groupName: 'A9', day: 'Monday', time: '14:00', room: 'IT 1' },
  { groupName: 'A15', day: 'Monday', time: '16:00', room: 'Computer Room' },
  { groupName: 'A12', day: 'Monday', time: '16:00', room: 'IT 2' },

  // Wednesday
  { groupName: 'B9', day: 'Wednesday', time: '10:00', room: 'Computer Room' },
  { groupName: 'A6', day: 'Wednesday', time: '10:00', room: 'IT 1' },
  { groupName: 'A16', day: 'Wednesday', time: '14:00', room: 'Computer Room' },
  { groupName: 'A9', day: 'Wednesday', time: '14:00', room: 'IT 1' },
  { groupName: 'A15', day: 'Wednesday', time: '16:00', room: 'Computer Room' },
  { groupName: 'A12', day: 'Wednesday', time: '16:00', room: 'IT 2' },

  // Friday
  { groupName: 'B9', day: 'Friday', time: '10:00', room: 'Computer Room' },
  { groupName: 'A6', day: 'Friday', time: '10:00', room: 'IT 1' },
  { groupName: 'A16', day: 'Friday', time: '14:00', room: 'Computer Room' },
  { groupName: 'A9', day: 'Friday', time: '14:00', room: 'IT 1' },
  { groupName: 'A15', day: 'Friday', time: '16:00', room: 'Computer Room' },
  { groupName: 'A12', day: 'Friday', time: '16:00', room: 'IT 2' },

  // Tuesday
  { groupName: 'B8', day: 'Tuesday', time: '10:00', room: 'Computer Room' },
  { groupName: 'A13', day: 'Tuesday', time: '14:00', room: 'Computer Room' },
  { groupName: 'A14', day: 'Tuesday', time: '15:00', room: 'Computer Room' },
  { groupName: 'A10', day: 'Tuesday', time: '15:00', room: 'IT 1' },

  // Thursday
  { groupName: 'B8', day: 'Thursday', time: '10:00', room: 'Computer Room' },
  { groupName: 'A13', day: 'Thursday', time: '14:00', room: 'Computer Room' },
  { groupName: 'A14', day: 'Thursday', time: '15:00', room: 'Computer Room' },
  { groupName: 'A10', day: 'Thursday', time: '15:00', room: 'IT 1' },

  // Saturday
  { groupName: 'B8', day: 'Saturday', time: '10:00', room: 'Computer Room' },
  { groupName: 'A13', day: 'Saturday', time: '14:00', room: 'Computer Room' },
  { groupName: 'A14', day: 'Saturday', time: '15:00', room: 'Computer Room' },
  { groupName: 'A10', day: 'Saturday', time: '15:00', room: 'IT 1' },
]

export function getDayOfWeek(dateStr: string): string {
  const parts = dateStr.split('-').map(Number)
  if (parts.length !== 3) return 'Sunday'
  // Date constructor takes 0-based month, local timezone construction avoids offset issues
  const dateObj = new Date(parts[0], parts[1] - 1, parts[2])
  return dateObj.toLocaleDateString('en-US', { weekday: 'long' })
}

export function getNowGroup(
  dayOfWeek: string,
  groups: Group[]
): { group: Group; slot: TimetableSlot; diffMinutes: number } | null {
  const slotsForDay = TIMETABLE.filter((s) => s.day === dayOfWeek)
  if (slotsForDay.length === 0) return null

  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  let closestSlot: TimetableSlot | null = null
  let minDiff = Infinity

  slotsForDay.forEach((slot) => {
    const [hours, minutes] = slot.time.split(':').map(Number)
    const slotMinutes = hours * 60 + minutes
    const diff = Math.abs(currentMinutes - slotMinutes)
    if (diff < minDiff) {
      minDiff = diff
      closestSlot = slot
    }
  })

  if (!closestSlot) return null

  const groupObj = groups.find((g) => g.name === closestSlot!.groupName)
  if (!groupObj) return null

  return {
    group: groupObj,
    slot: closestSlot,
    diffMinutes: minDiff,
  }
}
