import { useState } from 'react'

export type RowSaveStatus = 'idle' | 'saving' | 'error'

/** Tracks a per-row (per student) save status, keyed by id. Shared by Attendance
 * (fires immediately) and Homework (fires on Enter/blur) since both need the
 * same "optimistic update, retry on failure, no success toast" behavior. */
export function useSaveStatusMap() {
  const [statusMap, setStatusMap] = useState<Record<string, RowSaveStatus>>({})

  function setStatus(id: string, status: RowSaveStatus) {
    setStatusMap((prev) => (prev[id] === status ? prev : { ...prev, [id]: status }))
  }

  function getStatus(id: string): RowSaveStatus {
    return statusMap[id] ?? 'idle'
  }

  return { getStatus, setStatus }
}
