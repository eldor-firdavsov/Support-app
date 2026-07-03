import { useEffect, useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import { useStudentManagement } from '@/hooks/useStudentManagement'
import type { EntityStatus, Student } from '@/types'

interface ManageStudentsModalProps {
  groupId: string
  onClose: () => void
}

export function ManageStudentsModal({ groupId, onClose }: ManageStudentsModalProps) {
  const {
    students,
    loading,
    loadError,
    actionError,
    clearActionError,
    addStudent,
    editStudent,
    removeStudent,
    reload,
  } = useStudentManagement(groupId)

  const [newName, setNewName] = useState('')
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  async function handleAdd(e: FormEvent) {
    e.preventDefault()
    setAdding(true)
    const ok = await addStudent(newName)
    setAdding(false)
    if (ok) setNewName('')
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Manage students"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] w-full max-w-sm overflow-y-auto rounded-md bg-surface shadow-lg"
      >
        <div className="ledger-row flex items-center justify-between px-4 py-3">
          <h2 className="text-sm font-semibold text-ink">Manage students</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-7 w-7 items-center justify-center rounded-sm text-ink-muted hover:bg-accent-soft hover:text-ink transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>


        {loading && <p className="px-4 py-6 text-sm text-ink-muted">Loading students…</p>}

        {loadError && (
          <div className="px-4 py-6">
            <p role="alert" className="mb-3 text-sm text-absent">
              {loadError}
            </p>
            <button
              type="button"
              onClick={() => void reload()}
              className="text-sm text-accent underline underline-offset-2"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !loadError && (
          <>
            {students.length === 0 ? (
              <p className="px-4 py-6 text-sm text-ink-muted">No students yet. Add the first one below.</p>
            ) : (
              <ul>
                {students.map((student) => (
                  <StudentListItem
                    key={student.id}
                    student={student}
                    onSave={editStudent}
                    onDelete={removeStudent}
                  />
                ))}
              </ul>
            )}

            <form onSubmit={handleAdd} className="flex gap-2 border-t border-line px-4 py-3">
              <input
                type="text"
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value)
                  clearActionError()
                }}
                placeholder="Full name"
                aria-label="New student full name"
                className="min-w-0 flex-1 rounded-sm border border-line-strong bg-surface px-2.5 py-1.5 text-sm text-ink outline-none focus-visible:border-accent"
              />
              <button
                type="submit"
                disabled={adding || newName.trim() === ''}
                className="shrink-0 rounded-sm bg-accent px-3 py-1.5 text-sm font-medium text-accent-ink disabled:opacity-50"
              >
                Add
              </button>
            </form>

            {actionError && (
              <p role="alert" className="px-4 pb-3 text-xs text-absent">
                {actionError}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}

interface StudentListItemProps {
  student: Student
  onSave: (id: string, changes: { fullName: string; status: string }) => Promise<boolean>
  onDelete: (id: string) => Promise<boolean>
}

function StudentListItem({ student, onSave, onDelete }: StudentListItemProps) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(student.full_name)
  const [status, setStatus] = useState<string>(student.status)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    const ok = await onSave(student.id, { fullName: name, status })
    setSaving(false)
    if (ok) setEditing(false)
  }

  function handleCancel() {
    setName(student.full_name)
    setStatus(student.status)
    setEditing(false)
  }

  if (editing) {
    return (
      <li className="ledger-row space-y-2 px-4 py-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-label="Full name"
          className="w-full rounded-sm border border-line-strong bg-surface px-2.5 py-1.5 text-sm text-ink outline-none focus-visible:border-accent"
        />
        <div className="flex items-center justify-between gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as EntityStatus)}
            aria-label="Status"
            className="rounded-sm border border-line-strong bg-surface px-2 py-1 text-xs text-ink outline-none focus-visible:border-accent"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="text-xs text-ink-muted hover:text-ink"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={saving || name.trim() === ''}
              className="rounded-sm bg-accent px-2.5 py-1 text-xs font-medium text-accent-ink disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </li>
    )
  }

  if (confirmingDelete) {
    return (
      <li className="ledger-row flex items-center justify-between gap-2 px-4 py-3">
        <p className="text-xs text-ink">
          Delete <span className="font-medium">{student.full_name}</span> and all their attendance
          and homework history? This can't be undone.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => setConfirmingDelete(false)}
            className="text-xs text-ink-muted hover:text-ink"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void onDelete(student.id)}
            className="rounded-sm bg-absent px-2.5 py-1 text-xs font-medium text-accent-ink"
          >
            Delete
          </button>
        </div>
      </li>
    )
  }

  return (
    <li className="ledger-row flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="text-[15px] text-ink">{student.full_name}</span>
        {student.status === 'inactive' && (
          <span className="rounded-sm bg-accent-soft px-1.5 py-0.5 text-[11px] font-medium text-ink-muted">
            Inactive
          </span>
        )}
      </div>
      <div className="flex gap-3 text-xs">
        <button type="button" onClick={() => setEditing(true)} className="text-accent hover:underline">
          Edit
        </button>
        <button
          type="button"
          onClick={() => setConfirmingDelete(true)}
          className="text-ink-muted hover:text-absent"
        >
          Delete
        </button>
      </div>
    </li>
  )
}
