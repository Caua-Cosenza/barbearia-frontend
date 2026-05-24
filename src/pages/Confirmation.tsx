import { Link, useLocation } from 'react-router-dom'
import type { Appointment, BookingWizardState } from '../types'

interface LocationState {
  appointment: Appointment
  bookingInfo: BookingWizardState
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}min` : `${h}h`
}

export function Confirmation() {
  const location = useLocation()
  const data = location.state as LocationState | null

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-[#9ca3af] mb-4">Nenhum agendamento encontrado.</p>
          <Link to="/" className="text-[#2563eb] hover:text-[#3b82f6] transition-colors text-sm">
            Voltar ao início
          </Link>
        </div>
      </div>
    )
  }

  const { appointment, bookingInfo } = data
  const dateLabel = bookingInfo.date
    ? new Date(`${bookingInfo.date}T12:00:00`).toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '—'

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Success icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-[#22c55e]/15 border border-[#22c55e]/30 flex items-center justify-center mx-auto mb-5">
            <svg className="w-10 h-10 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Agendado!</h1>
          <p className="text-[#9ca3af]">Seu horário foi confirmado com sucesso.</p>
        </div>

        {/* Details card */}
        <div className="bg-[#1a1a2e] rounded-2xl p-5 border border-white/8 mb-5">
          <p className="text-[#9ca3af] text-xs font-semibold uppercase tracking-wider mb-4">
            Detalhes do agendamento
          </p>
          <dl className="space-y-3 text-sm">
            <DetailRow label="Profissional" value={bookingInfo.professional?.name ?? '—'} />
            <DetailRow
              label={bookingInfo.services.length > 1 ? 'Serviços' : 'Serviço'}
              value={bookingInfo.services.map((s) => s.name).join(' + ') || '—'}
            />
            <DetailRow
              label="Duração total"
              value={formatDuration(bookingInfo.services.reduce((sum, s) => sum + s.durationMinutes, 0))}
            />
            <div className="h-px bg-white/8" />
            <DetailRow label="Data" value={dateLabel} />
            <DetailRow label="Horário" value={bookingInfo.timeSlot ?? '—'} highlight />
            <div className="h-px bg-white/8" />
            <DetailRow label="Nome" value={bookingInfo.customerName} />
            <DetailRow label="Telefone" value={bookingInfo.customerPhone} />
            <DetailRow
              label="Status"
              value={appointment.status === 'PENDING' ? 'Pendente' : appointment.status}
              highlight
            />
          </dl>
        </div>

        <Link
          to="/"
          className="flex items-center justify-center gap-2 w-full bg-[#f97316] hover:bg-[#ea6c00] text-white font-bold py-4 rounded-xl transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-[#f97316]/20"
        >
          Fazer novo agendamento
        </Link>
      </div>
    </div>
  )
}

function DetailRow({ label, value, highlight }: Readonly<{ label: string; value: string; highlight?: boolean }>) {
  return (
    <div className="flex justify-between items-center gap-4">
      <dt className="text-[#9ca3af]">{label}</dt>
      <dd className={`font-semibold text-right ${highlight ? 'text-[#22c55e]' : 'text-white'}`}>
        {value}
      </dd>
    </div>
  )
}
