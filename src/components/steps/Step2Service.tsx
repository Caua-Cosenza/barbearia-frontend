import { useState, useEffect } from 'react'
import { api } from '../../api/endpoints'
import { LoadingSpinner } from '../shared/LoadingSpinner'
import { ErrorMessage } from '../shared/ErrorMessage'
import type { Service } from '../../types'

const MAX_DURATION = 50
const DEFAULT_VISIBLE = 3

interface Props {
  selected: Service[]
  onSelect: (services: Service[]) => void
  onNext: () => void
  onBack: () => void
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}min` : `${h}h`
}

function formatCurrency(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function cardPrice(s: Service): string {
  if (s.amountCents != null && s.amountCents > 0) return formatCurrency(s.amountCents)
  if (s.price != null && s.price > 0) {
    return s.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }
  return 'Consultar'
}

export default function Step2Service({ selected, onSelect, onNext, onBack }: Readonly<Props>) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [limitWarning, setLimitWarning] = useState(false)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    api.services
      .list()
      .then((res) => {
        if (res.success && res.data) setServices(res.data)
        else setError(res.error ?? 'Erro ao carregar serviços')
      })
      .catch(() => setError('Não foi possível carregar os serviços'))
      .finally(() => setLoading(false))
  }, [])

  const currentMins = selected.reduce((acc, s) => acc + (s.durationMinutes ?? 0), 0)
  const currentCents = selected.reduce((acc, s) => acc + (s.amountCents ?? 0), 0)
  const atLimit = currentMins >= MAX_DURATION

  function toggle(service: Service) {
    const isSelected = selected.some((s) => s.id === service.id)
    if (isSelected) {
      if (selected.length > 1) onSelect(selected.filter((s) => s.id !== service.id))
    } else {
      const newTotal = currentMins + (service.durationMinutes ?? 0)
      if (newTotal > MAX_DURATION) {
        setLimitWarning(true)
        return
      }
      setLimitWarning(false)
      onSelect([...selected, service])
    }
  }

  if (loading) return <LoadingSpinner />

  const visibleServices = showAll ? services : services.slice(0, DEFAULT_VISIBLE)
  const hasMore = services.length > DEFAULT_VISIBLE

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-1">Escolha os Serviços</h2>
      <p className="text-gray-400 text-sm mb-5">
        Selecione um ou mais serviços · máximo {MAX_DURATION} min
      </p>

      <ErrorMessage message={error} />

      {!error && (
        <>
          <div className="flex flex-col gap-3 mb-3">
            {visibleServices.map((s) => {
              const isSelected = selected.some((sel) => sel.id === s.id)
              const wouldExceed = !isSelected && (currentMins + (s.durationMinutes ?? 0)) > MAX_DURATION
              const price = cardPrice(s)
              const isConsultar = price === 'Consultar'

              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggle(s)}
                  disabled={wouldExceed}
                  className={[
                    'p-4 rounded-xl border-2 text-left transition-all duration-200',
                    wouldExceed
                      ? 'border-gray-800 bg-gray-900 opacity-40 cursor-not-allowed'
                      : isSelected
                        ? 'border-orange-500 bg-orange-500/10 ring-1 ring-orange-500/20'
                        : 'border-gray-700 bg-gray-800 hover:border-gray-500',
                  ].join(' ')}
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <div
                      className={[
                        'w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors mt-0.5',
                        isSelected
                          ? 'bg-orange-500 border-orange-500'
                          : 'border-gray-600 bg-transparent',
                      ].join(' ')}
                    >
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>

                    {/* Name + duration */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white text-sm leading-snug">{s.name}</p>
                      <span className="text-gray-500 text-xs mt-0.5 block">
                        ⏱ {formatDuration(s.durationMinutes)}
                      </span>
                    </div>

                    {/* Price — right aligned */}
                    <span
                      className={[
                        'font-semibold text-sm shrink-0 mt-0.5',
                        isConsultar ? 'text-zinc-400' : 'text-white',
                      ].join(' ')}
                    >
                      {price}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          {hasMore && (
            <div className="flex justify-center mb-3">
              <button
                type="button"
                onClick={() => setShowAll((v) => !v)}
                className="inline-flex items-center gap-2 border border-orange-500 text-orange-500 hover:bg-orange-500/10 text-sm font-medium px-4 py-2 rounded-lg transition-all duration-150"
              >
                {showAll ? (
                  <>
                    Ver menos
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                  </>
                ) : (
                  <>
                    Ver todos os serviços ({services.length})
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          )}
        </>
      )}

      {/* Limit badges */}
      {atLimit && (
        <p className="text-amber-400 text-xs font-medium mb-3">
          ⏱️ Tempo máximo atingido ({MAX_DURATION} min)
        </p>
      )}
      {limitWarning && !atLimit && (
        <p className="text-amber-400 text-xs font-medium mb-3">
          ⏱️ Este serviço ultrapassaria o limite de {MAX_DURATION} minutos
        </p>
      )}

      {/* Summary bar */}
      {selected.length > 0 && (
        <div className="bg-gray-800/80 border border-gray-700 rounded-xl px-4 py-3 mb-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          <span className="text-white font-medium">
            {selected.length} serviço{selected.length > 1 ? 's' : ''}
          </span>
          <span className="text-gray-600">·</span>
          <span className="text-orange-400 font-semibold">{formatCurrency(currentCents)}</span>
          <span className="text-gray-600">·</span>
          <span className="text-gray-400">{formatDuration(currentMins)}</span>
        </div>
      )}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 rounded-lg font-medium text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 transition-all duration-200"
        >
          ← Voltar
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={selected.length === 0}
          className={[
            'px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200',
            selected.length > 0
              ? 'bg-orange-500 hover:bg-orange-400 shadow-lg shadow-orange-500/25 hover:-translate-y-0.5'
              : 'bg-gray-700 opacity-50 cursor-not-allowed',
          ].join(' ')}
        >
          Próximo →
        </button>
      </div>
    </div>
  )
}
