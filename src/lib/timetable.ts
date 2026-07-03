import type { Group } from '@/types'

export interface TimetableSlot {
  groupName: string
  day: string
  time: string // e.g. "10:00"
  room: string
}

export const TIMETABLE: TimetableSlot[] = [
  // Monday
  { groupName: 'B9', day: 'Dushanba', time: '10:00', room: 'Computer Room' },
  { groupName: 'A6', day: 'Dushanba', time: '10:00', room: 'IT 1' },
  { groupName: 'A16', day: 'Dushanba', time: '14:00', room: 'Computer Room' },
  { groupName: 'A9', day: 'Dushanba', time: '14:00', room: 'IT 1' },
  { groupName: 'A15', day: 'Dushanba', time: '16:00', room: 'Computer Room' },
  { groupName: 'A12', day: 'Dushanba', time: '16:00', room: 'IT 2' },

  // Wednesday
  { groupName: 'B9', day: 'Chorshanba', time: '10:00', room: 'Computer Room' },
  { groupName: 'A6', day: 'Chorshanba', time: '10:00', room: 'IT 1' },
  { groupName: 'A16', day: 'Chorshanba', time: '14:00', room: 'Computer Room' },
  { groupName: 'A9', day: 'Chorshanba', time: '14:00', room: 'IT 1' },
  { groupName: 'A15', day: 'Chorshanba', time: '16:00', room: 'Computer Room' },
  { groupName: 'A12', day: 'Chorshanba', time: '16:00', room: 'IT 2' },

  // Friday
  { groupName: 'B9', day: 'Juma', time: '10:00', room: 'Computer Room' },
  { groupName: 'A6', day: 'Juma', time: '10:00', room: 'IT 1' },
  { groupName: 'A16', day: 'Juma', time: '14:00', room: 'Computer Room' },
  { groupName: 'A9', day: 'Juma', time: '14:00', room: 'IT 1' },
  { groupName: 'A15', day: 'Juma', time: '16:00', room: 'Computer Room' },
  { groupName: 'A12', day: 'Juma', time: '16:00', room: 'IT 2' },

  // Tuesday
  { groupName: 'B8', day: 'Seshanba', time: '10:00', room: 'Computer Room' },
  { groupName: 'A13', day: 'Seshanba', time: '14:00', room: 'Computer Room' },
  { groupName: 'A14', day: 'Seshanba', time: '15:00', room: 'Computer Room' },
  { groupName: 'A10', day: 'Seshanba', time: '15:00', room: 'IT 1' },

  // Thursday
  { groupName: 'B8', day: 'Payshanba', time: '10:00', room: 'Computer Room' },
  { groupName: 'A13', day: 'Payshanba', time: '14:00', room: 'Computer Room' },
  { groupName: 'A14', day: 'Payshanba', time: '15:00', room: 'Computer Room' },
  { groupName: 'A10', day: 'Payshanba', time: '15:00', room: 'IT 1' },

  // Saturday
  { groupName: 'B8', day: 'Shanba', time: '10:00', room: 'Computer Room' },
  { groupName: 'A13', day: 'Shanba', time: '14:00', room: 'Computer Room' },
  { groupName: 'A14', day: 'Shanba', time: '15:00', room: 'Computer Room' },
  { groupName: 'A10', day: 'Shanba', time: '15:00', room: 'IT 1' },
]

export function getDayOfWeek(dateStr: string): string {
  const parts = dateStr.split('-').map(Number)
  if (parts.length !== 3) return 'Yakshanba'
  const dateObj = new Date(parts[0], parts[1] - 1, parts[2])
  const days = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba']
  return days[dateObj.getDay()]
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
