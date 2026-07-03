import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { GroupHeader } from '@/components/group/GroupHeader'
import { TabBar, type GroupTab } from '@/components/group/TabBar'
import { AttendanceTab } from '@/components/group/AttendanceTab'
import { HomeworkTab } from '@/components/group/HomeworkTab'
import { ManageStudentsModal } from '@/components/students/ManageStudentsModal'
import { MonthSelector } from '@/components/dashboard/MonthSelector'
import { DateSelector } from '@/components/dashboard/DateSelector'
import { useSessionFilter } from '@/context/SessionFilterContext'
import { fetchGroupById } from '@/lib/groups'
import { daysInMonthUpToToday, todayIso } from '@/lib/dates'
import type { Group } from '@/types'

export function GroupPage() {
  const { groupId } = useParams<{ groupId: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { month, date, setMonth, setDate } = useSessionFilter()

  const [group, setGroup] = useState<Group | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [managingStudents, setManagingStudents] = useState(false)

  const tab = (searchParams.get('tab') as GroupTab) ?? 'attendance'

  // The URL is the source of truth when arriving via a link/refresh — reconcile
  // it into the shared session filter so the Dashboard reflects the same M/D on return.
  useEffect(() => {
    const urlMonth = searchParams.get('month')
    const urlDate = searchParams.get('date')
    if (urlMonth || urlDate) {
      if (urlMonth && urlMonth !== month) setMonth(urlMonth)
      if (urlDate && urlDate !== date) setDate(urlDate)
    } else {
      setSearchParams({ month, date, tab }, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!groupId) return
    let cancelled = false
    setLoading(true)
    setError(null)

    fetchGroupById(groupId)
      .then((data) => {
        if (cancelled) return
        if (!data) {
          setError('Bu guruhni topib bo\'lmadi.')
        } else {
          setGroup(data)
        }
      })
      .catch(() => {
        if (!cancelled) setError('Bu guruhni yuklab bo\'lmadi. Aloqani tekshiring.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [groupId])

  // If the selected date no longer falls inside the selected month (e.g. after
  // switching months), snap to the most recent valid day in that month.
  useEffect(() => {
    const validDays = daysInMonthUpToToday(month)
    if (validDays.length === 0) return
    if (!validDays.includes(date)) {
      const today = todayIso()
      const fallback = validDays.includes(today) ? today : validDays[validDays.length - 1]
      setDate(fallback)
      setSearchParams({ month, date: fallback, tab }, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month])

  function handleMonthChange(nextMonth: string) {
    setMonth(nextMonth)
    setSearchParams({ month: nextMonth, date, tab }, { replace: true })
  }

  function handleDateChange(nextDate: string) {
    setDate(nextDate)
    setSearchParams({ month, date: nextDate, tab }, { replace: true })
  }

  function handleTabChange(nextTab: GroupTab) {
    setSearchParams({ month, date, tab: nextTab }, { replace: true })
  }

  if (loading) {
    return <p className="px-4 py-6 text-sm text-ink-muted">Yuklanmoqda…</p>
  }

  if (error || !group || !groupId) {
    return (
      <div className="px-4 py-6">
        <p role="alert" className="mb-3 text-sm text-absent">
          {error ?? 'Bu guruhni topib bo\'lmadi.'}
        </p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="text-sm text-accent underline underline-offset-2"
        >
          Bosh sahifaga qaytish
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 py-8 md:py-12">
      {/* Top Navigation & Actions */}
      <div className="flex flex-col justify-between gap-4 border-b border-line pb-6 md:flex-row md:items-end">
        <GroupHeader groupName={`Guruh ${group.name}`} onManageStudents={() => setManagingStudents(true)} />
        
        <div className="flex items-center gap-3">
          <MonthSelector value={month} onChange={handleMonthChange} />
          <DateSelector month={month} value={date} onChange={handleDateChange} />
        </div>
      </div>

      {/* Main Register Area */}
      <main className="mt-8 rounded-md border border-line bg-surface shadow-sm overflow-hidden">
        <TabBar active={tab} onChange={handleTabChange} />
        <div className="divide-y divide-line">
          {tab === 'attendance' ? (
            <AttendanceTab groupId={groupId} date={date} />
          ) : (
            <HomeworkTab groupId={groupId} date={date} />
          )}
        </div>
      </main>

      {managingStudents && (
        <ManageStudentsModal groupId={groupId} onClose={() => setManagingStudents(false)} />
      )}
    </div>
  )
}

