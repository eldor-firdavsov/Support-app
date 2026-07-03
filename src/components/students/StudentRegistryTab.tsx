import React, { useEffect, useState } from 'react'
import {
  Search,
  Plus,
  ChevronDown,
  ChevronUp,
  Phone,
  Edit,
  GraduationCap
} from 'lucide-react'
import { fetchAllStudents, createStudent, updateStudent } from '@/lib/students'
import { fetchAllGroups } from '@/lib/groups'
import { StudentEditModal } from './StudentEditModal'
import type { Group, Student } from '@/types'

export function StudentRegistryTab() {
  const [students, setStudents] = useState<(Student & { groups: { name: string } | null })[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters and search
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGroup, setSelectedGroup] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  // Modals & Expansion
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null)

  async function loadData() {
    setLoading(true)
    setError(null)
    try {
      const [studentsData, groupsData] = await Promise.all([
        fetchAllStudents(),
        fetchAllGroups()
      ])
      setStudents(studentsData)
      setGroups(groupsData)
    } catch {
      setError('Could not load student directory.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [])

  const handleSaveStudent = async (studentData: Partial<Student>) => {
    if (editingStudent) {
      // Update
      const updated = await updateStudent(editingStudent.id, studentData)
      setStudents((prev) =>
        prev.map((s) => (s.id === editingStudent.id ? { ...s, ...updated } : s))
      )
    } else {
      // Create
      await createStudent(studentData as any)
      // Re-fetch to get group joins easily
      void loadData()
    }
  }

  // Filter students based on search term, group, and status
  const filteredStudents = students.filter((student) => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch =
      student.full_name.toLowerCase().includes(searchLower) ||
      student.student_number?.toLowerCase().includes(searchLower) ||
      (student.groups?.name || '').toLowerCase().includes(searchLower) ||
      student.contact?.toLowerCase().includes(searchLower)

    const matchesGroup = selectedGroup === 'all' || student.group_id === selectedGroup
    
    // Status filter matches: if 'all', we don't filter. If 'active' or others:
    const matchesStatus =
      selectedStatus === 'all' ||
      student.status.toLowerCase() === selectedStatus.toLowerCase()

    return matchesSearch && matchesGroup && matchesStatus
  })

  const toggleExpand = (studentId: string) => {
    setExpandedStudentId((prev) => (prev === studentId ? null : studentId))
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-present/10 text-present border border-present/20'
      case 'left':
        return 'bg-absent/10 text-absent border border-absent/20'
      case 'on hold':
        return 'bg-ink-muted/10 text-ink-muted border border-ink-muted/20'
      case 'completed':
      case 'finished':
        return 'bg-accent/10 text-accent border border-accent/20'
      default:
        return 'bg-ink-muted/10 text-ink-muted border border-ink-muted/20'
    }
  }

  return (
    <div className="space-y-6 p-4">
      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
        <div className="flex flex-1 flex-wrap items-center gap-3 min-w-[280px]">
          {/* Search box */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute top-2.5 left-3 h-4 w-4 text-ink-muted" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-sm border border-line-strong bg-surface pl-9 pr-4 py-2 text-xs text-ink placeholder:text-ink-muted focus:border-accent focus:outline-hidden"
              placeholder="Search by name, ID, group or email..."
            />
          </div>

          {/* Group dropdown */}
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="rounded-sm border border-line-strong bg-surface px-3 py-2 text-xs text-ink focus:border-accent focus:outline-hidden"
          >
            <option value="all">All Groups</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>

          {/* Status dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-sm border border-line-strong bg-surface px-3 py-2 text-xs text-ink focus:border-accent focus:outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="Left">Left</option>
            <option value="On hold">On Hold</option>
            <option value="Completed">Completed</option>
            <option value="Finished">Finished</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1.5 rounded-sm bg-accent px-4 py-2 text-xs font-bold text-accent-ink shadow-sm transition-all hover:bg-accent/90 hover:shadow active:scale-95 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add Student
        </button>
      </div>

      {loading && <p className="py-12 text-center text-sm text-ink-muted">Loading students...</p>}
      {error && <p className="py-12 text-center text-sm text-absent">{error}</p>}

      {!loading && !error && (
        <div className="overflow-hidden rounded-md border border-line bg-surface shadow-xs">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-line bg-accent-soft/30 font-bold uppercase tracking-wider text-ink-muted">
                  <th className="py-3 px-4 w-12">No/ID</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Group</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4 w-32">Status</th>
                  <th className="py-3 px-4 w-16 text-center">Details</th>
                  <th className="py-3 px-4 w-16 text-center">Edit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-ink-muted">
                      No students found matching current search/filter.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => {
                    const isExpanded = expandedStudentId === student.id
                    return (
                      <React.Fragment key={student.id}>
                        {/* Summary Row */}
                        <tr className="hover:bg-accent-soft/10 transition-colors">
                          <td className="py-3 px-4 font-bold text-ink-muted">
                            {student.student_number || '-'}
                          </td>
                          <td className="py-3 px-4 font-semibold text-ink">
                            {student.full_name}
                          </td>
                          <td className="py-3 px-4">
                            <span className="flex items-center gap-1 text-ink font-semibold">
                              <GraduationCap className="h-3.5 w-3.5 text-accent" />
                              {student.groups?.name || 'Unassigned'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-ink-muted font-mono">
                            {student.contact || '-'}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusColor(student.status)}`}>
                              {student.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => toggleExpand(student.id)}
                              className="text-ink-muted hover:text-ink transition-colors cursor-pointer"
                            >
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4 mx-auto" />
                              ) : (
                                <ChevronDown className="h-4 w-4 mx-auto" />
                              )}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => setEditingStudent(student)}
                              className="text-accent hover:text-accent/80 transition-colors cursor-pointer"
                            >
                              <Edit className="h-4 w-4 mx-auto" />
                            </button>
                          </td>
                        </tr>

                        {/* Expandable Info Panel */}
                        {isExpanded && (
                          <tr className="bg-accent-soft/10">
                            <td colSpan={7} className="p-4 border-l-2 border-accent">
                              <div className="flex flex-wrap gap-8 text-xs">
                                <div>
                                  <strong className="block font-bold text-accent uppercase tracking-wider mb-1">Student Contact</strong>
                                  <p className="flex items-center gap-1.5 text-ink font-mono">
                                    <Phone className="h-3.5 w-3.5 text-accent" />
                                    <span>{student.contact || 'No contact provided'}</span>
                                  </p>
                                </div>
                                <div>
                                  <strong className="block font-bold text-accent uppercase tracking-wider mb-1">Parent Contact</strong>
                                  <p className="flex items-center gap-1.5 text-ink font-mono">
                                    <Phone className="h-3.5 w-3.5 text-accent" />
                                    <span>{student.parent_contact || 'No parent contact provided'}</span>
                                  </p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-line">
            {filteredStudents.length === 0 ? (
              <div className="p-8 text-center text-ink-muted text-xs">
                No students found matching current filters.
              </div>
            ) : (
              filteredStudents.map((student) => {
                const isExpanded = expandedStudentId === student.id
                return (
                  <div key={student.id} className="p-4 space-y-3 bg-surface hover:bg-accent-soft/10">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-ink-muted">ID: {student.student_number || '-'}</span>
                        <h4 className="text-xs font-bold text-ink">{student.full_name}</h4>
                        <span className="flex items-center gap-1 text-[10px] text-accent font-semibold uppercase tracking-wider">
                          <GraduationCap className="h-3.5 w-3.5" />
                          {student.groups?.name || 'Unassigned'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${getStatusColor(student.status)}`}>
                          {student.status}
                        </span>
                        <button
                          type="button"
                          onClick={() => setEditingStudent(student)}
                          className="p-1.5 text-accent hover:bg-accent-soft rounded-sm transition-colors cursor-pointer"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[11px] text-ink-muted">
                      <span>Phone: <strong className="text-ink font-mono">{student.contact || '-'}</strong></span>
                      <button
                        type="button"
                        onClick={() => toggleExpand(student.id)}
                        className="flex items-center gap-1 text-accent font-bold cursor-pointer"
                      >
                        <span>{isExpanded ? 'Hide Info' : 'Show Details'}</span>
                        {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="pt-3 border-t border-dashed border-line space-y-2 text-[11px] text-ink-muted">
                        <div>
                          <strong className="text-accent uppercase tracking-wider text-[9px] block mb-0.5">Student Contact</strong>
                          <div className="text-ink font-mono">{student.contact || '-'}</div>
                        </div>
                        <div>
                          <strong className="text-accent uppercase tracking-wider text-[9px] block mb-0.5">Parent Contact</strong>
                          <div className="text-ink font-mono">{student.parent_contact || '-'}</div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}

      {(isAdding || editingStudent) && (
        <StudentEditModal
          student={editingStudent || undefined}
          groups={groups}
          onClose={() => {
            setIsAdding(false)
            setEditingStudent(null)
          }}
          onSave={handleSaveStudent}
        />
      )}
    </div>
  )
}
