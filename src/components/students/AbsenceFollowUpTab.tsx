import { useEffect, useState } from 'react'
import { Phone, AlertTriangle, Check } from 'lucide-react'
import { fetchAbsenceAlerts, type AbsenceAlert } from '@/lib/attendance'

export function AbsenceFollowUpTab() {
  const [alerts, setAlerts] = useState<AbsenceAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function loadAlerts() {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchAbsenceAlerts()
      setAlerts(data)
    } catch {
      setError('Could not load absence follow-up alerts.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadAlerts()
  }, [])

  const formatPhoneNumber = (num: string) => {
    return num.replace(/[^+\d]/g, '')
  }

  return (
    <div className="space-y-6 p-4">
      {/* Alert Banner */}
      <div className="rounded-md border border-absent bg-absent/5 p-4 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-absent shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h3 className="text-xs font-bold text-absent uppercase tracking-wider">
            Absence Action List
          </h3>
          <p className="text-xs text-ink-muted leading-relaxed">
            The students below have missed <strong>2 or more consecutive classes</strong>. Contact them and their parents immediately.
          </p>
        </div>
      </div>

      {loading && <p className="py-12 text-center text-sm text-ink-muted">Checking attendance registry...</p>}
      {error && <p className="py-12 text-center text-sm text-absent">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 gap-4">
          {alerts.length === 0 ? (
            <div className="rounded-md border border-line bg-surface p-12 text-center text-ink-muted">
              <Check className="mx-auto h-8 w-8 text-present mb-2" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-ink">All caught up!</h4>
              <p className="text-xs text-ink-muted mt-1">No active students have missed 2 or more consecutive classes.</p>
            </div>
          ) : (
            alerts.map((alert) => {
              const { student, groupName, consecutiveAbsences, lastDates } = alert

              return (
                <div
                  key={student.id}
                  className="rounded-md border border-line bg-surface shadow-xs p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-line-strong transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-[10px] bg-absent/10 text-absent border border-absent/20 px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider">
                        Absent {consecutiveAbsences} sessions
                      </span>
                      <h4 className="text-sm font-bold text-ink">{student.full_name}</h4>
                      <span className="text-xs text-ink-muted">
                        Group: <strong className="text-ink">{groupName}</strong>
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-ink-muted">
                      <span>Dates missed:</span>
                      {lastDates.map((date) => (
                        <span key={date} className="bg-accent-soft px-2 py-0.5 rounded-sm font-mono text-[10px] text-ink border border-line">
                          {date}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {/* Student Contact */}
                    {student.contact ? (
                      <a
                        href={`tel:${formatPhoneNumber(student.contact)}`}
                        className="flex items-center gap-2 rounded-sm border border-line bg-accent-soft/20 px-4 py-2 text-xs text-ink hover:bg-accent-soft transition-colors cursor-pointer"
                      >
                        <Phone className="h-3.5 w-3.5 text-accent" />
                        <span>Student: <strong className="font-mono">{student.contact}</strong></span>
                      </a>
                    ) : (
                      <div className="rounded-sm border border-line bg-line/20 px-4 py-2 text-xs text-ink-muted">
                        <span>Student: No contact</span>
                      </div>
                    )}

                    {/* Parent Contact */}
                    {student.parent_contact ? (
                      <a
                        href={`tel:${formatPhoneNumber(student.parent_contact)}`}
                        className="flex items-center gap-2 rounded-sm border border-line bg-accent-soft/20 px-4 py-2 text-xs text-ink hover:bg-accent-soft transition-colors cursor-pointer"
                      >
                        <Phone className="h-3.5 w-3.5 text-accent" />
                        <span>Parent: <strong className="font-mono">{student.parent_contact}</strong></span>
                      </a>
                    ) : (
                      <div className="rounded-sm border border-line bg-line/20 px-4 py-2 text-xs text-ink-muted">
                        <span>Parent: No contact</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
