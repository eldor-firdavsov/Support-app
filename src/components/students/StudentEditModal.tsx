import React, { useState } from 'react'
import { X, Save } from 'lucide-react'
import type { Group, Student } from '@/types'

interface StudentEditModalProps {
  student?: Student // If undefined, we are adding a new student
  groups: Group[]
  onClose: () => void
  onSave: (studentData: Partial<Student>) => Promise<void>
}

export function StudentEditModal({ student, groups, onClose, onSave }: StudentEditModalProps) {
  const [formData, setFormData] = useState<Partial<Student>>({
    full_name: student?.full_name || '',
    group_id: student?.group_id || (groups[0]?.id || ''),
    status: student?.status || 'active',
    student_number: student?.student_number || '',
    contact: student?.contact || '',
    parent_contact: student?.parent_contact || '',
  })

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.full_name?.trim()) {
      setError('Student name is required.')
      return
    }
    if (!formData.group_id) {
      setError('Please select a group.')
      return
    }

    setSaving(true)
    setError(null)
    try {
      await onSave(formData)
      onClose()
    } catch (err: any) {
      setError(err?.message || 'Failed to save student details.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-md border border-line bg-surface shadow-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-6 py-4 bg-accent-soft/30">
          <h2 className="text-sm font-bold uppercase tracking-wider text-ink">
            {student ? 'Edit Student Profile' : 'Add New Student'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-ink-muted hover:text-ink transition-colors p-1 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <p role="alert" className="text-xs font-semibold text-absent bg-absent/10 p-3 rounded-sm">
              {error}
            </p>
          )}

          <div>
            <label className="block text-xs font-bold text-ink-muted mb-1">Full Name *</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full rounded-sm border border-line-strong bg-surface px-3 py-1.5 text-xs text-ink placeholder:text-ink-muted focus:border-accent focus:outline-hidden"
              placeholder="e.g. Alimov Husniddin"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-ink-muted mb-1">Student ID / Number</label>
              <input
                type="text"
                name="student_number"
                value={formData.student_number}
                onChange={handleChange}
                className="w-full rounded-sm border border-line-strong bg-surface px-3 py-1.5 text-xs text-ink placeholder:text-ink-muted focus:border-accent focus:outline-hidden"
                placeholder="e.g. 5"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink-muted mb-1">Assigned Group *</label>
              <select
                name="group_id"
                value={formData.group_id}
                onChange={handleChange}
                className="w-full rounded-sm border border-line-strong bg-surface px-3 py-1.5 text-xs text-ink focus:border-accent focus:outline-hidden"
              >
                <option value="">Select a Group</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-ink-muted mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-sm border border-line-strong bg-surface px-3 py-1.5 text-xs text-ink focus:border-accent focus:outline-hidden"
              >
                <option value="active">Active</option>
                <option value="Left">Left</option>
                <option value="On hold">On hold</option>
                <option value="Completed">Completed</option>
                <option value="Finished">Finished</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink-muted mb-1">Student Contact</label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                className="w-full rounded-sm border border-line-strong bg-surface px-3 py-1.5 text-xs text-ink placeholder:text-ink-muted focus:border-accent focus:outline-hidden"
                placeholder="e.g. 91 709 03 82"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-ink-muted mb-1">Parent Contact</label>
            <input
              type="text"
              name="parent_contact"
              value={formData.parent_contact}
              onChange={handleChange}
              className="w-full rounded-sm border border-line-strong bg-surface px-3 py-1.5 text-xs text-ink placeholder:text-ink-muted focus:border-accent focus:outline-hidden"
              placeholder="e.g. 88 800 88 97"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-line px-6 py-4 bg-accent-soft/30">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-sm border border-line-strong px-4 py-2 text-xs font-bold text-ink transition-all hover:bg-accent-soft active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-sm bg-accent px-5 py-2 text-xs font-bold text-accent-ink shadow-sm transition-all hover:bg-accent/90 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Student'}
          </button>
        </div>
      </div>
    </div>
  )
}
