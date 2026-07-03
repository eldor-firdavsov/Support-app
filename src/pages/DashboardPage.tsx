import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, Plus, Clock, MapPin, ArrowRight, Users } from 'lucide-react'
import { useSessionFilter } from '@/context/SessionFilterContext'
import { MonthSelector } from '@/components/dashboard/MonthSelector'
import { DateSelector } from '@/components/dashboard/DateSelector'
import { GroupList } from '@/components/dashboard/GroupList'
import { AddGroupModal } from '@/components/dashboard/AddGroupModal'
import { StudentRegistryTab } from '@/components/students/StudentRegistryTab'
import { AbsenceFollowUpTab } from '@/components/students/AbsenceFollowUpTab'
import { fetchActiveGroups } from '@/lib/groups'
import { daysInMonthUpToToday, todayIso } from '@/lib/dates'
import { getDayOfWeek, getNowGroup, TIMETABLE } from '@/lib/timetable'
import { fetchAbsenceAlerts } from '@/lib/attendance'
import type { Group } from '@/types'

export function DashboardPage() {
  const { month, date, setMonth, setDate } = useSessionFilter()
  const navigate = useNavigate()

  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addingGroup, setAddingGroup] = useState(false)
  const [filterMode, setFilterMode] = useState<'today' | 'all'>('today')

  // Tabs state
  const [activeTab, setActiveTab] = useState<'groups' | 'students' | 'absences'>('groups')
  const [absenceCount, setAbsenceCount] = useState(0)

  function loadGroups() {
    setLoading(true)
    setError(null)
    fetchActiveGroups()
      .then((data) => {
        setGroups(data)
      })
        setError('Guruhlarni yuklab bo\'lmadi. Aloqani tekshiring.')
      .finally(() => {
        setLoading(false)
      })
  }

  function loadAbsenceCount() {
    fetchAbsenceAlerts()
      .then((data) => {
        setAbsenceCount(data.length)
      })
      .catch(() => {})
  }

  useEffect(() => {
    loadGroups()
  }, [])

  // Update count of absences when groups load, tab switches, or when returning to page
  useEffect(() => {
    loadAbsenceCount()
  }, [groups, activeTab])

  // If the selected date no longer falls inside the selected month (e.g. after
  // switching months), snap to the most recent valid day in that month.
  useEffect(() => {
    const validDays = daysInMonthUpToToday(month)
    if (validDays.length === 0) return
    if (!validDays.includes(date)) {
      const today = todayIso()
      const fallback = validDays.includes(today) ? today : validDays[validDays.length - 1]
      setDate(fallback)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month])

  function handleGroupAdded(newGroup: Group) {
    setAddingGroup(false)
    navigate(`/group/${newGroup.id}?month=${month}&date=${date}&tab=attendance`)
  }

  // Calculate day of the week and filter
  const dayOfWeek = getDayOfWeek(date)
  const todayGroupNames = new Set(
    TIMETABLE.filter((s) => s.day === dayOfWeek).map((s) => s.groupName)
  )

  const displayedGroups = filterMode === 'today'
    ? groups.filter((g) => todayGroupNames.has(g.name))
    : groups

  // Calculate closest "now" group
  const isSelectedDateToday = date === todayIso()
  const nowGroupData = isSelectedDateToday ? getNowGroup(dayOfWeek, groups) : null

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 py-8 md:py-12">
      {/* Premium Header Banner */}
      <header className="mb-6 flex flex-col justify-between gap-4 border-b border-line pb-6 md:flex-row md:items-end">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-accent" />
            <h1 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">
              O'qituvchi boshqaruvi
            </h1>
          </div>
          <p className="text-xs md:text-sm text-ink-muted">
            O'quvchilar davomati, uy vazifasi va guruhlarni boshqarish.
          </p>
        </div>

        {/* Toolbar controls (only visible if on groups tab) */}
        {activeTab === 'groups' && (
          <div className="flex flex-wrap items-center gap-3">
            {/* Today vs All Filter Switch */}
            <div className="flex rounded-sm bg-accent-soft p-1 border border-line-strong">
              <button
                type="button"
                onClick={() => setFilterMode('today')}
                className={`rounded-sm px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                  filterMode === 'today'
                    ? 'bg-accent text-accent-ink shadow-sm'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                Bugun
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('all')}
                className={`rounded-sm px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                  filterMode === 'all'
                    ? 'bg-accent text-accent-ink shadow-sm'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                Barchasi
              </button>
            </div>

            <div className="flex gap-2">
              <MonthSelector value={month} onChange={setMonth} />
              <DateSelector month={month} value={date} onChange={setDate} />
            </div>
            <button
              type="button"
              onClick={() => setAddingGroup(true)}
              className="flex items-center gap-1.5 rounded-sm bg-accent px-4 py-2 text-xs font-semibold text-accent-ink shadow-sm transition-all hover:bg-accent/90 hover:shadow active:scale-95 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Guruh qo'shish
            </button>
          </div>
        )}
      </header>

      {/* Premium Tab Bar Switcher */}
      <div className="mb-6 flex border-b border-line overflow-x-auto whitespace-nowrap scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('groups')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'groups'
              ? 'border-accent text-accent'
              : 'border-transparent text-ink-muted hover:text-ink'
          }`}
        >
          <GraduationCap className="h-4 w-4" />
          Guruhlar va jadvallar
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('students')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'students'
              ? 'border-accent text-accent'
              : 'border-transparent text-ink-muted hover:text-ink'
          }`}
        >
          <Users className="h-4 w-4" />
          O'quvchilarni qidirish
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('absences')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'absences'
              ? 'border-accent text-accent'
              : 'border-transparent text-ink-muted hover:text-ink'
          }`}
        >
          <Clock className="h-4 w-4" />
          Davomat ogohlantirishlari
          {absenceCount > 0 && (
            <span className="rounded-full bg-absent px-1.5 py-0.5 text-[9px] font-bold text-surface animate-pulse">
              {absenceCount}
            </span>
          )}
        </button>
      </div>

      {/* Tab Render Switch */}
      {activeTab === 'groups' && (
        <div className="space-y-8">
          {/* "Now" / "Next Class" Spotlight Card */}
          {nowGroupData && (
            <div className="rounded-md border border-accent bg-accent-soft p-6 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
              {/* Blinking Live Indicator */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-accent/15 text-accent px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                Hozirgi dars
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-accent uppercase tracking-wider">
                  Joriy / Keyingi dars
                </span>
                <h2 className="text-2xl font-bold text-ink">
                  Group {nowGroupData.group.name}
                </h2>
              </div>

              <div className="mt-4 flex flex-wrap gap-5 text-sm text-ink-muted">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-accent" />
                  <span>{nowGroupData.slot.time}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-accent" />
                  <span>{nowGroupData.slot.room}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-accent" />
                  <span>{nowGroupData.group.studentCount ?? 0} faol o'quvchilar</span>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate(`/group/${nowGroupData.group.id}?month=${month}&date=${date}&tab=attendance`)}
                  className="flex items-center gap-1.5 bg-accent text-accent-ink px-4 py-2 rounded-sm text-xs font-bold shadow-sm transition-all hover:bg-accent/90 cursor-pointer active:scale-95"
                >
                  <span>Jurnalni ochish</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          <main className="rounded-md border border-line bg-surface shadow-sm overflow-hidden">
            <div className="border-b border-line bg-accent-soft/30 px-4 py-3 flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                {filterMode === 'today' ? `${dayOfWeek} darslari` : 'Barcha darslar'} ({displayedGroups.length})
              </h2>
              {filterMode === 'today' && displayedGroups.length === 0 && (
                <span className="text-[10px] bg-line px-2 py-0.5 rounded-sm text-ink-muted font-semibold">
                  Dam olish kuni / Bo'sh kun
                </span>
              )}
            </div>
            {loading && <p className="px-4 py-12 text-center text-sm text-ink-muted">Guruhlar yuklanmoqda…</p>}
            {error && (
              <p role="alert" className="px-4 py-12 text-center text-sm text-absent">
                Guruhlarni yuklab bo'lmadi. Aloqani tekshiring.
              </p>
            )}
            {!loading && !error && <GroupList groups={displayedGroups} month={month} date={date} />}
          </main>
        </div>
      )}

      {activeTab === 'students' && <StudentRegistryTab />}

      {activeTab === 'absences' && <AbsenceFollowUpTab />}

      {addingGroup && (
        <AddGroupModal
          existingGroups={groups}
          onClose={() => setAddingGroup(false)}
          onAdded={handleGroupAdded}
        />
      )}
    </div>
  )
}



