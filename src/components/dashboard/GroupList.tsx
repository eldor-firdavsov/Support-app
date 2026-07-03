import { useNavigate } from 'react-router-dom'
import { BookOpen, Users, ChevronRight } from 'lucide-react'
import type { Group } from '@/types'

interface GroupListProps {
  groups: Group[]
  month: string
  date: string
}

export function GroupList({ groups, month, date }: GroupListProps) {
  const navigate = useNavigate()

  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <BookOpen className="mb-3 h-10 w-10 text-ink-muted" />
        <h3 className="text-sm font-semibold text-ink">No groups yet</h3>
        <p className="mt-1 text-xs text-ink-muted">Click "+ Add Group" to create your first class.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {groups.map((group) => (
        <div
          key={group.id}
          className="group relative flex flex-col justify-between overflow-hidden rounded-md border border-line bg-surface p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-md cursor-pointer"
          onClick={() =>
            navigate(`/group/${group.id}?month=${month}&date=${date}&tab=attendance`)
          }
        >
          {/* Top Line Decoration (Classroom aesthetic) */}
          <div className="absolute top-0 inset-x-0 h-1 bg-line-strong transition-colors group-hover:bg-accent" />

          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-ink tracking-tight group-hover:text-accent transition-colors">
                Group {group.name}
              </h3>
              <p className="text-xs text-ink-muted flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                <span>{group.studentCount ?? 0} active students</span>
              </p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft text-accent group-hover:bg-accent group-hover:text-accent-ink transition-all">
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-line/60 pt-3">
            <span className="text-[11px] font-semibold tracking-wider text-ink-muted uppercase">
              A/B Group
            </span>
            <span className="text-xs text-accent font-medium group-hover:underline">
              Enter Register
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}


