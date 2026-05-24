import { ErrorMessage } from '../shared/ErrorMessage'
import type { BookingWizardState } from '../../types'

interface Props {
  state: BookingWizardState
  onChangeField: (
    field: 'customerName' | 'customerPhone' | 'customerEmail',
    value: string,
  ) => void
  onBack: () => void
  onSubmit: () => void
  submitting: boolean
  error: string | null
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}min` : `${h}h`
}

function formatCents(cents: number): string {
  return `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`
}

function servicePrice(s: { amountCents?: number; price?: number | null }): number | null {
  if (s.amountCents != null) return s.amountCents
  if (s.price != null) return Math.round(s.price * 100)
  return null
}

function formatDate(dateStr: string): string {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function Step4Confirm({
  state,
  onChangeField,
  onBack,
  onSubmit,
  submitting,
  error,
}: Props) {
  const canSubmit =
    state.customerName.trim().length >= 2 && state.customerPhone.trim().length >= 10

  const servicePrices = state.services.map(servicePrice)
  const allServicesHavePrice = servicePrices.every((p) => p !== null)
  const totalMins = state.services.reduce((sum, s) => sum + s.durationMinutes, 0)
  const totalCentsVal = allServicesHavePrice
    ? servicePrices.reduce<number>((sum, p) => sum + (p ?? 0), 0)
    : null

  const inputClass =
    'w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 ' +
    'focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all'

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-6">Confirmar Agendamento</h2>

      {/* Summary card */}
      <div className="bg-gray-800 rounded-xl p-5 mb-6 border border-gray-700">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">Resumo</p>
        <dl className="space-y-3">
          <div className="flex justify-between text-sm">
            <dt className="text-gray-400">Profissional</dt>
            <dd className="text-white font-medium">{state.professional?.name}</dd>
          </div>

          {/* Service list */}
          {state.services.map((s) => {
            const cents = servicePrice(s)
            return (
              <div key={s.id} className="flex justify-between text-sm">
                <dt className="text-gray-400">{s.name}</dt>
                <dd className="text-white font-medium">
                  {cents != null ? formatCents(cents) : 'Consultar'}
                </dd>
              </div>
            )
          })}

          {/* Totals */}
          {state.services.length > 0 && (
            <>
              <div className="h-px bg-gray-700" />
              {allServicesHavePrice && totalCentsVal !== null && (
                <div className="flex justify-between text-sm font-semibold">
                  <dt className="text-gray-300">Total</dt>
                  <dd className="text-orange-400">{formatCents(totalCentsVal)}</dd>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <dt className="text-gray-400">Tempo total</dt>
                <dd className="text-white font-medium">{formatDuration(totalMins)}</dd>
              </div>
            </>
          )}

          <div className="h-px bg-gray-700" />
          <div className="flex justify-between text-sm">
            <dt className="text-gray-400">Data</dt>
            <dd className="text-white font-medium text-right capitalize">
              {state.date ? formatDate(state.date) : '—'}
            </dd>
          </div>
          <div className="flex justify-between items-center">
            <dt className="text-gray-400 text-sm">Horário</dt>
            <dd className="text-violet-400 font-bold text-lg">{state.timeSlot}</dd>
          </div>
        </dl>
      </div>

      {/* Customer data form */}
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">Seus dados</p>
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5" htmlFor="customerName">
            Nome completo <span className="text-red-400">*</span>
          </label>
          <input
            id="customerName"
            type="text"
            value={state.customerName}
            onChange={(e) => onChangeField('customerName', e.target.value)}
            placeholder="Seu nome"
            autoComplete="name"
            className={inputClass}
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-300 mb-1.5"
            htmlFor="customerPhone"
          >
            Telefone / WhatsApp <span className="text-red-400">*</span>
          </label>
          <input
            id="customerPhone"
            type="tel"
            value={state.customerPhone}
            onChange={(e) => onChangeField('customerPhone', e.target.value)}
            placeholder="(11) 99999-9999"
            autoComplete="tel"
            className={inputClass}
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-300 mb-1.5"
            htmlFor="customerEmail"
          >
            Email <span className="text-gray-500 font-normal">(opcional)</span>
          </label>
          <input
            id="customerEmail"
            type="email"
            value={state.customerEmail}
            onChange={(e) => onChangeField('customerEmail', e.target.value)}
            placeholder="seu@email.com"
            autoComplete="email"
            className={inputClass}
          />
        </div>
      </div>

      <ErrorMessage message={error} />
      {error && <div className="mb-4" />}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="px-6 py-3 rounded-lg font-medium text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 transition-all duration-200 disabled:opacity-50"
        >
          ← Voltar
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit || submitting}
          className={[
            'px-8 py-3 rounded-lg font-bold text-white transition-all duration-200',
            canSubmit && !submitting
              ? 'bg-orange-500 hover:bg-orange-400 shadow-lg shadow-orange-500/25 hover:-translate-y-0.5'
              : 'bg-gray-700 opacity-50 cursor-not-allowed',
          ].join(' ')}
        >
          {submitting ? 'Agendando...' : 'Confirmar Agendamento'}
        </button>
      </div>
    </div>
  )
}
