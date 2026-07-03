import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

interface GroupHeaderProps {
  groupName: string
  onManageStudents: () => void
}

export function GroupHeader({ groupName, onManageStudents }: GroupHeaderProps) {
  const navigate = useNavigate()

  return (
    <header className="flex items-center gap-3 py-2 flex-1">
      <button
        type="button"
        onClick={() => navigate('/')}
        aria-label="Back to dashboard"
        className="flex h-8 w-8 items-center justify-center rounded-sm text-ink-muted hover:bg-accent-soft hover:text-ink transition-colors border border-line cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>

      <h1 className="text-xl font-bold tracking-tight text-ink md:text-2xl">{groupName}</h1>
      <button
        type="button"
        onClick={onManageStudents}
        className="text-xs bg-accent-soft text-accent px-2.5 py-1.5 rounded-sm font-semibold transition-colors hover:bg-accent hover:text-accent-ink cursor-pointer"
      >
        Manage Students
      </button>
    </header>
  )
}

