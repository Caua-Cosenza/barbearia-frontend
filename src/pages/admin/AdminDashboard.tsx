import { useState, useEffect, useCallback } from 'react'
import { api } from '../../api/endpoints'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { usePushNotification } from '../../hooks/usePushNotification'
import type { AdminAppointment, AdminStats, AdminAppointmentStatus } from '../../types'

const PUSH_DISMISSED_KEY = 'push_banner_dismissed'

// ---- Status badge config ----

const STATUS_CONFIG: Record<AdminAppointmentStatus, { label: string; className: string }> = {
  PENDING:   { label: 'Pendente',     className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  CONFIRMED: { label: 'Confirmado',   className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  CANCELLED: { label: 'Cancelado',    className: 'bg-red-500/20 text-red-400 border-red-500/30' },
  COMPLETED: { label: 'Concluído',    className: 'bg-green-500/20 text-green-400 border-green-500/30' },
  NO_SHOW:   { label: 'Não apareceu', className: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
}

// ---- Helpers ----

function todayISO(): string {
  return new Date().toISOString().split('T')[0]
}

function formatTime(isoStr: string): string {
  return new Date(isoStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

function appointmentHasPassed(scheduledAt: string, durationMinutes: number): boolean {
  const end = new Date(scheduledAt)
  end.setMinutes(end.getMinutes() + durationMinutes)
  return new Date() > end
}

function getEffectiveBadge(status: AdminAppointmentStatus, hasPassed: boolean) {
  if (hasPassed && (status === 'PENDING' || status === 'CONFIRMED')) {
    return STATUS_CONFIG['COMPLETED']
  }
  return STATUS_CONFIG[status]
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 10) return 'Atualizado agora'
  if (seconds < 60) return `Atualizado há ${seconds}s`
  const minutes = Math.floor(seconds / 60)
  return `Atualizado há ${minutes}min`
}

// ---- Stat card ----

function StatCard({ title, value, accent, loading }: {
  title: string
  value: number
  accent: string
  loading: boolean
}) {
  if (loading) {
    return (
      <div className="bg-[#1a1a2e] rounded-xl p-4 border border-white/5 animate-pulse">
        <div className="h-3 bg-white/5 rounded mb-3 w-2/3" />
        <div className="h-8 bg-white/5 rounded w-1/3" />
      </div>
    )
  }
  return (
    <div className="bg-[#1a1a2e] rounded-xl p-4 border border-white/5">
      <p className="text-[#9ca3af] text-xs font-medium uppercase tracking-wider mb-2">{title}</p>
      <p className={`text-3xl font-bold ${accent}`}>{value}</p>
    </div>
  )
}

// ---- Action buttons ----

function ActionButtons({ status, updating, hasPassed, onFinalize, onCancel }: {
  status: AdminAppointmentStatus
  updating: boolean
  hasPassed: boolean
  onFinalize: () => void
  onCancel: () => void
}) {
  const [confirmingCancel, setConfirmingCancel] = useState(false)

  if (updating) {
    return (
      <div className="flex items-center gap-1.5">
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        <span className="text-[#9ca3af] text-xs">Salvando...</span>
      </div>
    )
  }

  if (hasPassed && (status === 'PENDING' || status === 'CONFIRMED')) {
    return <span className="text-green-400 text-xs font-medium">✅ Concluído</span>
  }

  if (status === 'COMPLETED') return <span className="text-green-400 text-xs font-medium">✅ Finalizado</span>
  if (status === 'CANCELLED') return <span className="text-red-400 text-xs font-medium">❌ Cancelado</span>
  if (status === 'NO_SHOW')   return <span className="text-purple-400 text-xs font-medium">Não compareceu</span>

  if (confirmingCancel) {
    return (
      <div className="space-y-1.5">
        <p className="text-[#9ca3af] text-xs">Tem certeza? O horário será liberado.</p>
        <div className="flex gap-2">
          <button
            onClick={() => { setConfirmingCancel(false); onCancel() }}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition-colors"
          >
            Sim
          </button>
          <button
            onClick={() => setConfirmingCancel(false)}
            className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-white text-sm font-medium rounded transition-colors"
          >
            Não
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {(status === 'PENDING' || status === 'CONFIRMED') && (
        <button
          onClick={onFinalize}
          className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded transition-colors"
        >
          Finalizar corte
        </button>
      )}
      <button
        onClick={() => setConfirmingCancel(true)}
        className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/40 text-red-400 text-sm font-medium rounded border border-red-600/30 transition-colors"
      >
        Cancelar
      </button>
    </div>
  )
}

// ---- Desktop table row ----

function AppointmentRow({ appointment: a, updating, onStatusChange }: {
  appointment: AdminAppointment
  updating: boolean
  onStatusChange: (id: string, status: AdminAppointmentStatus) => void
}) {
  const hasPassed = appointmentHasPassed(a.scheduledAt, a.service.durationMinutes)
  const badge = getEffectiveBadge(a.status, hasPassed)
  return (
    <tr className="hover:bg-white/[0.02] transition-colors">
      <td className="px-6 py-4 text-sm text-white font-mono whitespace-nowrap">{formatTime(a.scheduledAt)}</td>
      <td className="px-6 py-4 text-sm text-white">{a.customerName}</td>
      <td className="px-6 py-4 text-sm text-[#9ca3af] font-mono whitespace-nowrap">{a.customerPhone}</td>
      <td className="px-6 py-4 text-sm text-white">{a.service.name}</td>
      <td className="px-6 py-4 text-sm text-[#9ca3af] whitespace-nowrap">{a.service.durationMinutes} min</td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badge.className}`}>
          {badge.label}
        </span>
      </td>
      <td className="px-6 py-4">
        <ActionButtons
          status={a.status}
          updating={updating}
          hasPassed={hasPassed}
          onFinalize={() => onStatusChange(a.id, 'COMPLETED')}
          onCancel={() => onStatusChange(a.id, 'CANCELLED')}
        />
      </td>
    </tr>
  )
}

// ---- Mobile card ----

function AppointmentCard({ appointment: a, updating, onStatusChange }: {
  appointment: AdminAppointment
  updating: boolean
  onStatusChange: (id: string, status: AdminAppointmentStatus) => void
}) {
  const hasPassed = appointmentHasPassed(a.scheduledAt, a.service.durationMinutes)
  const badge = getEffectiveBadge(a.status, hasPassed)
  return (
    <div className="px-4 py-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-white font-medium text-sm">{a.customerName}</p>
          <p className="text-[#9ca3af] text-xs font-mono mt-0.5">{a.customerPhone}</p>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className="text-white font-mono text-sm">{formatTime(a.scheduledAt)}</span>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${badge.className}`}>
            {badge.label}
          </span>
        </div>
      </div>
      <p className="text-xs text-[#9ca3af]">
        {a.service.name} · {a.service.durationMinutes} min · {a.professional.name}
      </p>
      <ActionButtons
        status={a.status}
        updating={updating}
        hasPassed={hasPassed}
        onFinalize={() => onStatusChange(a.id, 'COMPLETED')}
        onCancel={() => onStatusChange(a.id, 'CANCELLED')}
      />
    </div>
  )
}

// ---- Skeleton rows ----

function SkeletonRows({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="px-4 lg:px-6 py-4 animate-pulse border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="h-4 bg-white/5 rounded w-12 shrink-0" />
            <div className="h-4 bg-white/5 rounded flex-1 max-w-[140px]" />
            <div className="h-6 bg-white/5 rounded w-20 ml-auto" />
          </div>
        </div>
      ))}
    </>
  )
}

// ---- Error banner ----

function ErrorBanner({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-between">
      <p className="text-red-400 text-sm">{message}</p>
      <button onClick={onDismiss} className="text-red-400 hover:text-red-300 ml-4 shrink-0">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

// ---- Main component ----

export function AdminDashboard() {
  const { requestPermission, subscribe } = usePushNotification()

  const [showPushBanner, setShowPushBanner] = useState(
    () =>
      'Notification' in globalThis &&
      Notification.permission !== 'granted' &&
      !localStorage.getItem(PUSH_DISMISSED_KEY),
  )
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [appointments, setAppointments] = useState<AdminAppointment[]>([])
  const [date, setDate] = useState<string>(todayISO())
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingAppts, setLoadingAppts] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [refreshing, setRefreshing] = useState(false)
  const [, setTick] = useState(0)

  async function handleEnableNotifications() {
    const granted = await requestPermission()
    if (!granted) {
      localStorage.setItem(PUSH_DISMISSED_KEY, '1')
      setShowPushBanner(false)
      return
    }
    setShowPushBanner(false)
    const subscription = await subscribe()
    if (!subscription) return
    const json = subscription.toJSON()
    if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) return
    void api.admin.savePushSubscription({
      endpoint: json.endpoint,
      keys: { p256dh: json.keys.p256dh, auth: json.keys.auth },
    })
  }

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.admin.stats()
      if (res.success && res.data) setStats(res.data)
    } catch {
      setError('Erro ao carregar estatísticas')
    }
  }, [])

  const fetchAppointments = useCallback(async (d: string) => {
    try {
      const res = await api.admin.appointments(d)
      if (res.success && res.data) setAppointments(res.data)
    } catch {
      setError('Erro ao carregar agendamentos')
    }
  }, [])

  // Initial stats load
  useEffect(() => {
    fetchStats().finally(() => setLoadingStats(false))
  }, [fetchStats])

  // Load appointments when date changes
  useEffect(() => {
    setLoadingAppts(true)
    fetchAppointments(date).finally(() => setLoadingAppts(false))
  }, [date, fetchAppointments])

  const refreshData = useCallback(async (silent = false) => {
    if (!silent) setRefreshing(true)
    try {
      await Promise.all([fetchStats(), fetchAppointments(date)])
      setLastUpdate(new Date())
    } finally {
      if (!silent) setRefreshing(false)
    }
  }, [fetchStats, fetchAppointments, date])

  // Auto-refresh every 30s
  useEffect(() => {
    const interval = setInterval(() => { void refreshData(true) }, 30000)
    return () => clearInterval(interval)
  }, [refreshData])

  // Tick every 10s to keep "atualizado há X" label fresh
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 10000)
    return () => clearInterval(t)
  }, [])

  async function handleStatusChange(id: string, status: AdminAppointmentStatus) {
    if (updatingId) return
    setUpdatingId(id)
    try {
      const res = await api.admin.updateStatus(id, status)
      if (res.success) {
        setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))
        void fetchStats()
      }
    } catch {
      setError('Erro ao atualizar status. Tente novamente.')
    } finally {
      setUpdatingId(null)
    }
  }

  const appointmentCount = appointments.length

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <button
              onClick={() => { void refreshData(false) }}
              disabled={refreshing}
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
            >
              <svg
                className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {refreshing ? 'Atualizando...' : 'Atualizar'}
            </button>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-[#9ca3af] text-sm">Visão geral dos agendamentos</p>
            <span className="text-zinc-600 text-xs">· {formatTimeAgo(lastUpdate)}</span>
          </div>
        </div>

        {showPushBanner && (
          <div className="flex items-center justify-between gap-3 px-4 py-3 bg-[#2563eb]/10 border border-[#2563eb]/20 rounded-xl text-sm">
            <span className="text-[#9ca3af]">
              🔔 Ative as notificações para receber alertas de novos agendamentos
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleEnableNotifications}
                className="px-3 py-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium rounded-lg transition-colors text-xs"
              >
                Ativar notificações
              </button>
              <button
                onClick={() => {
                  localStorage.setItem(PUSH_DISMISSED_KEY, '1')
                  setShowPushBanner(false)
                }}
                className="text-[#4b5563] hover:text-[#9ca3af] transition-colors"
                aria-label="Fechar"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <StatCard title="Hoje"        value={stats?.todayCount ?? 0}  accent="text-[#2563eb]"  loading={loadingStats} />
          <StatCard title="Esta Semana" value={stats?.weekCount ?? 0}   accent="text-[#f97316]"  loading={loadingStats} />
          <StatCard title="Este Mês"    value={stats?.monthCount ?? 0}  accent="text-[#22c55e]"  loading={loadingStats} />
          <StatCard title="No-Shows"    value={stats?.noShowCount ?? 0} accent="text-purple-400" loading={loadingStats} />
        </div>

        {/* Appointments section */}
        <div className="bg-[#1a1a2e] rounded-2xl border border-white/5 overflow-hidden">

          {/* Controls */}
          <div className="px-4 lg:px-6 py-4 border-b border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-white font-semibold">Agendamentos</h2>
              {!loadingAppts && (
                <p className="text-[#9ca3af] text-xs mt-0.5">
                  {appointmentCount} agendamento{appointmentCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-[#0f0f0f] border border-white/10 rounded-lg px-3 py-2
                         text-white text-sm focus:outline-none focus:border-[#2563eb]
                         transition-colors cursor-pointer self-start sm:self-auto"
            />
          </div>

          {/* Content */}
          {loadingAppts ? (
            <SkeletonRows count={4} />
          ) : appointments.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-[#9ca3af] text-sm">Nenhum agendamento para esta data</p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5 text-left">
                      {['Hora', 'Cliente', 'Telefone', 'Serviço', 'Duração', 'Status', 'Ações'].map((h) => (
                        <th key={h} className="px-6 py-3 text-xs font-medium text-[#9ca3af] uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {appointments.map((a) => (
                      <AppointmentRow
                        key={a.id}
                        appointment={a}
                        updating={updatingId === a.id}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="lg:hidden divide-y divide-white/5">
                {appointments.map((a) => (
                  <AppointmentCard
                    key={a.id}
                    appointment={a}
                    updating={updatingId === a.id}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
