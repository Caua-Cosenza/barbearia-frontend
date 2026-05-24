import { useState, useEffect, useCallback } from 'react'
import { api } from '../../api/endpoints'
import { LoadingSpinner } from '../shared/LoadingSpinner'
import type { Professional } from '../../types'

interface Props {
  professional: Professional
  serviceId: string
  selectedDate: string | null
  selectedTimeSlot: string | null
  onSelectDate: (date: string) => void
  onSelectTimeSlot: (slot: string) => void
  onNext: () => void
  onBack: () => void
}

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]
const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export default function Step3DateTime({
  professional,
  serviceId,
  selectedDate,
  selectedTimeSlot,
  onSelectDate,
  onSelectTimeSlot,
  onNext,
  onBack,
}: Props) {
  const now = new Date()
  const [viewYear, setViewYear] = useState(now.getFullYear())
  const [viewMonth, setViewMonth] = useState(now.getMonth())
  const [slots, setSlots] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [slotsError, setSlotsError] = useState<string | null>(null)

  const todayStr = toDateStr(now.getFullYear(), now.getMonth(), now.getDate())

  const fetchSlots = useCallback(
    async (date: string) => {
      setLoadingSlots(true)
      setSlotsError(null)
      try {
        const res = await api.availableTimes.fetch({ professionalId: professional.id, serviceId, date })
        if (res.success && res.data) {
          setSlots(res.data.slots ?? [])
        } else {
          setSlotsError(res.error ?? 'Nenhum horário disponível')
          setSlots([])
        }
      } catch {
        setSlotsError('Erro ao buscar horários disponíveis')
        setSlots([])
      } finally {
        setLoadingSlots(false)
      }
    },
    [professional.id, serviceId],
  )

  useEffect(() => {
    if (selectedDate) fetchSlots(selectedDate)
  }, [selectedDate, fetchSlots])

  function prevMonth() {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11) }
    else setViewMonth((m) => m - 1)
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0) }
    else setViewMonth((m) => m + 1)
  }

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay()

  function isDayDisabled(day: number): boolean {
    const dateStr = toDateStr(viewYear, viewMonth, day)
    if (dateStr < todayStr) return true
    const maxDate = new Date()
    maxDate.setDate(maxDate.getDate() + 90)
    const maxDateStr = toDateStr(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate())
    if (dateStr > maxDateStr) return true
    const weekday = new Date(viewYear, viewMonth, day).getDay()
    if (professional.availability?.length > 0) {
      return !professional.availability.some((a) => a.dayOfWeek === weekday)
    }
    return false
  }

  const selectedDateLabel = selectedDate
    ? new Date(`${selectedDate}T12:00:00`).toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      })
    : ''

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-6">Escolha a Data e Horário</h2>

      {/* Calendar */}
      <div className="bg-gray-800 rounded-xl p-4 mb-6 border border-gray-700">
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={prevMonth}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors text-lg leading-none"
            aria-label="Mês anterior"
          >
            ‹
          </button>
          <span className="text-white font-semibold">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </span>
          <button
            type="button"
            onClick={nextMonth}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors text-lg leading-none"
            aria-label="Próximo mês"
          >
            ›
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 mb-1">
          {WEEKDAY_LABELS.map((d) => (
            <div key={d} className="text-center text-xs font-medium text-gray-500 py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstWeekday }).map((_, i) => (
            <div key={`pad-${i}`} />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const dateStr = toDateStr(viewYear, viewMonth, day)
            const disabled = isDayDisabled(day)
            const isSelected = selectedDate === dateStr
            const isToday = dateStr === todayStr

            return (
              <button
                key={day}
                type="button"
                disabled={disabled}
                onClick={() => onSelectDate(dateStr)}
                className={[
                  'aspect-square rounded-lg text-sm font-medium transition-all duration-150 flex items-center justify-center',
                  disabled ? 'text-gray-700 cursor-not-allowed' : 'cursor-pointer hover:bg-violet-700/40',
                  isSelected ? 'bg-violet-600 text-white shadow-md shadow-violet-500/30' : '',
                  isToday && !isSelected ? 'border border-violet-500/50 text-violet-300' : '',
                  !isSelected && !disabled && !isToday ? 'text-gray-300' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>

      {/* Time slots */}
      {selectedDate && (
        <div className="mb-6">
          <h3 className="text-white font-medium mb-3 capitalize">{selectedDateLabel}</h3>

          {loadingSlots ? (
            <LoadingSpinner />
          ) : slotsError || slots.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-400 text-sm">
                {slotsError ?? 'A barbearia não funciona neste dia.'}
              </p>
              {!slotsError && (
                <p className="text-gray-600 text-xs mt-1">Selecione outra data.</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {slots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => onSelectTimeSlot(slot)}
                  className={[
                    'py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                    selectedTimeSlot === slot
                      ? 'bg-violet-600 text-white shadow-md shadow-violet-500/20'
                      : 'bg-gray-800 text-gray-300 border border-gray-700 hover:border-violet-500/60 hover:text-white hover:bg-violet-900/30',
                  ].join(' ')}
                >
                  {slot}
                </button>
              ))}
            </div>
          )}
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
          disabled={!selectedDate || !selectedTimeSlot}
          className={[
            'px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200',
            selectedDate && selectedTimeSlot
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
