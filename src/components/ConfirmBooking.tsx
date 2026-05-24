import { formatDate, formatDuration } from '../utils/formatting'
import type { Appointment } from '../types'

interface Props {
  appointment: Appointment
  onClose: () => void
}

export function ConfirmBooking({ appointment, onClose }: Props) {
  return (
    <div role="dialog" aria-modal="true" aria-label="Confirmação de agendamento">
      <h2>Agendamento Confirmado!</h2>
      <dl>
        <dt>Profissional</dt>
        <dd>{appointment.professional.name}</dd>

        <dt>Serviço</dt>
        <dd>
          {appointment.service.name} ({formatDuration(appointment.service.durationMinutes)})
        </dd>

        <dt>Data e Hora</dt>
        <dd>{formatDate(appointment.scheduledAt)}</dd>

        <dt>Status</dt>
        <dd>{appointment.status}</dd>
      </dl>
      <button type="button" onClick={onClose}>
        Fechar
      </button>
    </div>
  )
}
