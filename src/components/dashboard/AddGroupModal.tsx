import { useEffect, useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import { createGroup } from '@/lib/groups'
import type { Group } from '@/types'

interface AddGroupModalProps {
  existingGroups: Group[]
  onClose: () => void
  onAdded: (newGroup: Group) => void
}

export function AddGroupModal({ existingGroups, onClose, onAdded }: AddGroupModalProps) {
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    const trimmed = name.trim().toUpperCase()
    if (!trimmed) {
      setError('Guruh nomi kiritilishi shart.')
      return
    }

    // Validate format: A or B followed by one or more digits (e.g., A6, B12)
    const regex = /^[AB]\d+$/
    if (!regex.test(trimmed)) {
      setError('Guruh nomi A yoki B harfi va raqamdan iborat bo\'lishi kerak (masalan: A11, B4).')
      return
    }

    // Check for duplicates
    const isDuplicate = existingGroups.some(
      (g) => g.name.toUpperCase() === trimmed && g.status === 'active'
    )
    if (isDuplicate) {
      setError('Bunday nomli guruh allaqachon mavjud.')
      return
    }

    setSaving(true)
    try {
      const newGroup = await createGroup(trimmed)
      onAdded(newGroup)
    } catch {
      setError('Guruh yaratib bo\'lmadi. Aloqani tekshiring va qaytadan urinib ko\'ring.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Add new group"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm overflow-hidden rounded-md bg-surface shadow-lg"
      >
        <div className="ledger-row flex items-center justify-between px-4 py-3">
          <h2 className="text-sm font-semibold text-ink">Yangi guruh qo'shish</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-7 w-7 items-center justify-center rounded-sm text-ink-muted hover:bg-accent-soft hover:text-ink transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>


        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="group-name" className="text-xs font-semibold text-ink-muted">
              Guruh nomi
            </label>
            <input
              id="group-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError(null)
              }}
              placeholder="e.g. A11, B4"
              className="w-full rounded-sm border border-line-strong bg-surface px-2.5 py-1.5 text-sm text-ink outline-none focus-visible:border-accent"
              autoFocus
            />
          </div>

          {error && (
            <p role="alert" className="text-xs text-absent leading-normal">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-sm px-3 py-1.5 text-sm text-ink-muted hover:text-ink"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="rounded-sm bg-accent px-4 py-1.5 text-sm font-medium text-accent-ink transition-colors hover:bg-accent/90 disabled:opacity-50"
            >
              {saving ? 'Yaratilmoqda…' : 'Yaratish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
