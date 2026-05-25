import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/endpoints'
import type { Service, Professional } from '../types'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  services: Service[]
  professionals: Professional[]
  initialService?: Service | null
  initialProfessional?: Professional | null
}

const WEEKDAYS_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MONTHS_SHORT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
const MONTH_NAMES_FULL = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

interface CalendarDay {
  iso: string
  day: number
  weekday: string
  month: string
}

function buildCalendar(count = 30): CalendarDay[] {
  const days: CalendarDay[] = []
  const d = new Date()
  while (days.length < count) {
    const weekday = d.getDay()
    if (weekday !== 0 && weekday !== 1) {
      days.push({
        iso: d.toISOString().split('T')[0],
        day: d.getDate(),
        weekday: WEEKDAYS_SHORT[weekday],
        month: MONTHS_SHORT[d.getMonth()],
      })
    }
    d.setDate(d.getDate() + 1)
  }
  return days
}

function formatPrice(price: number | null | undefined): string {
  if (price == null) return 'Consultar'
  return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}min` : `${h}h`
}

function formatPhone(v: string): string {
  const d = v.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7, 11)}`
}

const PROFESSIONAL_PHOTOS: Record<string, string> = {
  'Jhonatan Correa': '/jhonatan.jpeg',
}

const CALENDAR = buildCalendar()

export default function BookingModal({
  isOpen,
  onClose,
  services,
  professionals,
  initialService,
  initialProfessional,
}: BookingModalProps) {
  const navigate = useNavigate()

  const [selectedServices, setSelectedServices] = useState<Service[]>([])
  const [professional, setProfessional] = useState<Professional | null>(null)
  const [date, setDate] = useState<string | null>(null)
  const [timeSlot, setTimeSlot] = useState<string | null>(null)
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [slots, setSlots] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAllServices, setShowAllServices] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [calMonth, setCalMonth] = useState(() => new Date())

  const dateRowRef = useRef<HTMLDivElement>(null)

  // Reset state when modal opens
  useEffect(() => {
    if (!isOpen) return
    setSelectedServices(initialService ? [initialService] : [])
    setProfessional(initialProfessional ?? null)
    setDate(null)
    setTimeSlot(null)
    setCustomerName('')
    setCustomerPhone('')
    setSlots([])
    setError(null)
    setShowAllServices(false)
    setShowCalendar(false)
    setCalMonth(new Date())
  }, [isOpen, initialService, initialProfessional])

  // Fetch available slots when date + professional + at least one service are set
  useEffect(() => {
    if (!date || !professional || selectedServices.length === 0) {
      setSlots([])
      setTimeSlot(null)
      return
    }
    setLoadingSlots(true)
    setTimeSlot(null)
    const timeout = setTimeout(() => {
      const totalDurationMinutes = selectedServices.reduce((acc, s) => acc + (s.durationMinutes ?? 0), 0)
      api.availableTimes
        .fetch({
          professionalId: professional.id,
          serviceId: selectedServices[0].id,
          date,
          totalDurationMinutes: totalDurationMinutes > 0 ? totalDurationMinutes : undefined,
        })
        .then((res) => setSlots(res.data?.slots ?? []))
        .catch(() => setSlots([]))
        .finally(() => setLoadingSlots(false))
    }, 300)
    return () => {
      clearTimeout(timeout)
      setLoadingSlots(false)
    }
  }, [date, professional, selectedServices])

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  const canSubmit =
    selectedServices.length > 0 &&
    !!professional &&
    !professional.isWalkIn &&
    !!date &&
    !!timeSlot &&
    customerName.trim().length >= 2 &&
    customerPhone.replace(/\D/g, '').length >= 10

  async function handleSubmit() {
    if (!canSubmit || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await api.appointments.createPublic({
        professionalId: professional?.id ?? '',
        serviceIds: selectedServices.map((s) => s.id),
        scheduledAt: `${date}T${timeSlot}:00-03:00`,
        guestName: customerName.trim(),
        guestPhone: customerPhone.replace(/\D/g, ''),
      })
      if (res.success && res.data) {
        onClose()
        navigate('/booking/confirmation', {
          state: {
            appointment: res.data,
            bookingInfo: {
              professional,
              services: selectedServices,
              date,
              timeSlot,
              customerName: customerName.trim(),
              customerPhone: customerPhone.replace(/\D/g, ''),
              customerEmail: '',
            },
          },
        })
      } else {
        setError(res.error ?? res.message ?? 'Erro ao criar agendamento')
      }
    } catch {
      setError('Não foi possível criar o agendamento. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Calendar helpers ────────────────────────────────────────────────────
  const todayDate = new Date()
  const todayStr = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, '0')}-${String(todayDate.getDate()).padStart(2, '0')}`
  const maxDate = new Date(todayDate.getTime() + 60 * 24 * 60 * 60 * 1000)
  const maxDateStr = `${maxDate.getFullYear()}-${String(maxDate.getMonth() + 1).padStart(2, '0')}-${String(maxDate.getDate()).padStart(2, '0')}`
  const calY = calMonth.getFullYear()
  const calMo = calMonth.getMonth()
  const calDaysInMonth = new Date(calY, calMo + 1, 0).getDate()
  const calFirstWeekday = new Date(calY, calMo, 1).getDay()

  function isCalDayDisabled(day: number): boolean {
    const dateStr = `${calY}-${String(calMo + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    if (dateStr < todayStr) return true
    if (dateStr > maxDateStr) return true
    const weekday = new Date(calY, calMo, day).getDay()
    if (professional?.availability && professional.availability.length > 0) {
      return !professional.availability.some((a) => a.dayOfWeek === weekday)
    }
    return weekday === 0 || weekday === 1
  }

  function prevCalMonth() {
    setCalMonth((m) => { const d = new Date(m); d.setMonth(d.getMonth() - 1); return d })
  }

  function nextCalMonth() {
    setCalMonth((m) => { const d = new Date(m); d.setMonth(d.getMonth() + 1); return d })
  }
  // ────────────────────────────────────────────────────────────────────────

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Agendar horário"
        className="relative w-full sm:max-w-lg bg-[#0f0f0f] sm:rounded-2xl rounded-t-2xl border border-white/10 max-h-[92dvh] flex flex-col animate-slide-up"
      >
        {/* Handle (mobile) */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/8 shrink-0">
          <h2 className="text-white font-bold text-base">Agendar Horário</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-[#9ca3af] hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Fechar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 modal-scroll px-5 py-5 space-y-7">

          {/* ── SERVIÇO ── */}
          <section>
            <SectionLabel step={1} label="Serviço" done={selectedServices.length > 0} />
            <div className="space-y-2 mt-3">
              {(showAllServices ? services : services.slice(0, 3)).map((svc) => {
                const isSelected = selectedServices.some((s) => s.id === svc.id)
                const hasPrice = svc.amountCents != null && svc.amountCents > 0
                const priceLabel = hasPrice
                  ? (svc.amountCents! / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                  : svc.price != null
                    ? svc.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                    : 'Consultar'
                return (
                  <button
                    key={svc.id}
                    onClick={() => {
                      if (isSelected) {
                        if (selectedServices.length > 1) {
                          setSelectedServices(selectedServices.filter((s) => s.id !== svc.id))
                        }
                      } else {
                        setSelectedServices([...selectedServices, svc])
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl border text-left transition-all duration-150 ${
                      isSelected
                        ? 'border-[#2563eb] bg-[#2563eb]/10'
                        : 'border-white/5 bg-[#1a1a2e] hover:border-white/15'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold truncate">{svc.name}</p>
                      <p className="text-[#9ca3af] text-xs mt-0.5">{formatDuration(svc.durationMinutes)}</p>
                    </div>
                    <span className={`font-semibold text-sm whitespace-nowrap shrink-0 ${hasPrice || svc.price != null ? 'text-white' : 'text-zinc-400'}`}>
                      {priceLabel}
                    </span>
                    {isSelected && (
                      <svg className="w-5 h-5 text-[#2563eb] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                )
              })}
            </div>
            {services.length > 3 && (
              <button
                type="button"
                onClick={() => setShowAllServices((v) => !v)}
                className="w-full mt-3 py-2 text-sm text-orange-500 border border-orange-500/40 rounded-lg hover:bg-orange-500/10 transition-colors"
              >
                {showAllServices ? 'Ver menos ↑' : `Ver mais serviços (${services.length - 3}) ↓`}
              </button>
            )}
          </section>

          {/* ── PROFISSIONAL ── */}
          <section>
            <SectionLabel step={2} label="Profissional" done={!!professional} />
            <div
              className="flex gap-2.5 overflow-x-auto pb-1 -mx-5 px-5 scrollbar-hide mt-3"
            >
              {professionals.map((pro) => {
                const photoSrc = PROFESSIONAL_PHOTOS[pro.name] ?? pro.photoUrl
                return (
                  <button
                    key={pro.id}
                    onClick={() => setProfessional(pro)}
                    className={`flex flex-col items-center gap-1.5 shrink-0 px-3 py-3 rounded-xl border transition-all duration-150 min-w-[80px] ${
                      professional?.id === pro.id
                        ? 'border-[#2563eb] bg-[#2563eb]/10'
                        : 'border-white/5 bg-[#1a1a2e] hover:border-white/15'
                    }`}
                  >
                    {photoSrc ? (
                      <img
                        src={photoSrc}
                        alt={pro.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2563eb]/30 to-[#f97316]/30 flex items-center justify-center">
                        <span className="text-white font-bold text-base">{pro.name[0]}</span>
                      </div>
                    )}
                    <span className="text-white text-xs font-medium text-center leading-tight max-w-[72px] truncate">
                      {pro.name.split(' ')[0]}
                    </span>
                    {professional?.id === pro.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb]" />
                    )}
                  </button>
                )
              })}
            </div>
          </section>

          {/* ── Walk-in info ── */}
          {professional?.isWalkIn && (
            <section className="bg-zinc-900 border border-amber-500/30 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl" aria-hidden="true">✂️</span>
                <div>
                  <h3 className="text-white font-bold text-base leading-tight">Atendimento por Ordem de Chegada</h3>
                  <span className="inline-flex mt-1 items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    Sem agendamento necessário
                  </span>
                </div>
              </div>
              <div className="h-px bg-amber-500/15" />
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-lg leading-none mt-0.5 shrink-0" aria-hidden="true">📍</span>
                  <div>
                    <p className="text-white text-sm font-medium">Compareça à barbearia</p>
                    <p className="text-[#9ca3af] text-xs mt-0.5">no horário de funcionamento</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lg leading-none mt-0.5 shrink-0" aria-hidden="true">⏱️</span>
                  <div>
                    <p className="text-white text-sm font-medium">Aguarde na fila de chegada</p>
                    <p className="text-[#9ca3af] text-xs mt-0.5">Sem necessidade de agendamento</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lg leading-none mt-0.5 shrink-0" aria-hidden="true">💈</span>
                  <div>
                    <p className="text-white text-sm font-medium">Horário de funcionamento</p>
                    <div className="mt-1 space-y-0.5 text-xs text-[#9ca3af] font-mono">
                      <p>Ter–Sáb:&nbsp;&nbsp;08:20 – 19:00</p>
                      <p>Dom–Seg:&nbsp;&nbsp;Fechado</p>
                    </div>
                  </div>
                </li>
              </ul>
            </section>
          )}

          {/* ── DATA ── */}
          {!professional?.isWalkIn && (
          <section>
            <SectionLabel step={3} label="Data" done={!!date} />

            {showCalendar ? (
              /* ── Monthly calendar ── */
              <div className="mt-3 bg-zinc-900 rounded-xl p-3 border border-white/5">
                {/* Month navigation */}
                <div className="flex items-center justify-between mb-2 px-1">
                  <button
                    type="button"
                    onClick={prevCalMonth}
                    className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors text-lg leading-none"
                    aria-label="Mês anterior"
                  >
                    ‹
                  </button>
                  <span className="text-white font-semibold text-sm">
                    {MONTH_NAMES_FULL[calMo]} {calY}
                  </span>
                  <button
                    type="button"
                    onClick={nextCalMonth}
                    className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors text-lg leading-none"
                    aria-label="Próximo mês"
                  >
                    ›
                  </button>
                </div>

                {/* Weekday headers */}
                <div className="grid grid-cols-7 mb-1">
                  {WEEKDAYS_SHORT.map((w) => (
                    <div key={w} className="text-center text-[10px] font-medium text-zinc-500 py-1 uppercase">
                      {w}
                    </div>
                  ))}
                </div>

                {/* Day grid */}
                <div className="grid grid-cols-7 gap-0.5">
                  {Array.from({ length: calFirstWeekday }).map((_, i) => (
                    <div key={`pad-${i}`} />
                  ))}
                  {Array.from({ length: calDaysInMonth }).map((_, i) => {
                    const day = i + 1
                    const dateStr = `${calY}-${String(calMo + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                    const disabled = isCalDayDisabled(day)
                    const isSelected = date === dateStr
                    const isToday = dateStr === todayStr
                    return (
                      <button
                        key={day}
                        type="button"
                        disabled={disabled}
                        onClick={() => { setDate(dateStr); setShowCalendar(false) }}
                        className={[
                          'min-h-[40px] rounded-lg text-sm font-medium transition-all duration-150 flex items-center justify-center',
                          disabled ? 'text-zinc-700 cursor-not-allowed opacity-30' : 'cursor-pointer hover:bg-[#2563eb]/30',
                          isSelected ? 'bg-[#2563eb] text-white' : '',
                          isToday && !isSelected ? 'border border-[#2563eb]/50 text-[#93c5fd]' : '',
                          !isSelected && !disabled && !isToday ? 'text-zinc-300' : '',
                        ].filter(Boolean).join(' ')}
                      >
                        {day}
                      </button>
                    )
                  })}
                </div>

                {/* Back to strip */}
                <button
                  type="button"
                  onClick={() => setShowCalendar(false)}
                  className="w-full mt-3 py-2 text-xs text-zinc-400 hover:text-white border border-white/10 rounded-lg hover:border-white/20 transition-colors"
                >
                  ← Voltar para semana
                </button>
              </div>
            ) : (
              /* ── 7-day strip ── */
              <>
                <div
                  ref={dateRowRef}
                  className="flex gap-2 overflow-x-auto pb-1 -mx-5 px-5 scrollbar-hide mt-3"
                >
                  {CALENDAR.map((d) => (
                    <button
                      key={d.iso}
                      onClick={() => setDate(d.iso)}
                      className={`flex flex-col items-center shrink-0 w-[54px] py-3 rounded-xl border transition-all duration-150 ${
                        date === d.iso
                          ? 'border-[#2563eb] bg-[#2563eb] text-white'
                          : 'border-white/5 bg-[#1a1a2e] text-[#9ca3af] hover:border-white/20 hover:text-white'
                      }`}
                    >
                      <span className="text-[10px] font-semibold uppercase tracking-wide">{d.weekday}</span>
                      <span className="text-xl font-extrabold leading-snug">{d.day}</span>
                      <span className="text-[10px]">{d.month}</span>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setShowCalendar(true)}
                  className="w-full mt-2 py-2 text-sm text-orange-500 border border-orange-500/30 rounded-lg hover:bg-orange-500/10 transition-colors"
                >
                  📅 Mais datas
                </button>
              </>
            )}
          </section>
          )}

          {/* ── HORÁRIOS ── */}
          {date && professional && !professional.isWalkIn && (
            <section>
              <SectionLabel step={4} label="Horário" done={!!timeSlot} />
              <div className="mt-3">
                {loadingSlots ? (
                  <div className="grid grid-cols-4 gap-2">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="h-10 bg-[#1a1a2e] rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : slots.length === 0 ? (
                  <p className="text-[#9ca3af] text-sm text-center py-5 bg-[#1a1a2e] rounded-xl border border-white/5">
                    Nenhum horário disponível nesta data.
                  </p>
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    {slots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setTimeSlot(slot)}
                        className={`py-2.5 rounded-lg text-sm font-semibold border transition-all duration-150 ${
                          timeSlot === slot
                            ? 'border-[#2563eb] bg-[#2563eb] text-white'
                            : 'border-white/5 bg-[#1a1a2e] text-[#9ca3af] hover:border-white/20 hover:text-white'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ── DADOS DO CLIENTE ── */}
          {!professional?.isWalkIn && (
          <section>
            <SectionLabel step={5} label="Seus dados" done={customerName.trim().length >= 2 && customerPhone.replace(/\D/g, '').length >= 10} />
            <div className="space-y-3 mt-3">
              <div>
                <label className="block text-[#9ca3af] text-xs font-medium mb-1.5">
                  Nome completo
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Seu nome"
                  autoComplete="name"
                  className="w-full bg-[#1a1a2e] border border-white/10 focus:border-[#2563eb] rounded-xl px-4 py-3 text-white placeholder-[#4b5563] text-sm outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-[#9ca3af] text-xs font-medium mb-1.5">
                  Telefone / WhatsApp
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(formatPhone(e.target.value))}
                  placeholder="(00) 00000-0000"
                  autoComplete="tel"
                  inputMode="numeric"
                  className="w-full bg-[#1a1a2e] border border-white/10 focus:border-[#2563eb] rounded-xl px-4 py-3 text-white placeholder-[#4b5563] text-sm outline-none transition-colors"
                />
              </div>
            </div>
          </section>
          )}

          {/* ── RESUMO ── */}
          {selectedServices.length > 0 && professional && !professional.isWalkIn && date && timeSlot && (
            <div className="bg-[#1a1a2e] rounded-xl p-4 border border-white/8 space-y-2 text-sm">
              <p className="text-[#9ca3af] text-xs font-semibold uppercase tracking-wider mb-3">Resumo</p>
              {selectedServices.map((svc) => (
                <Row
                  key={svc.id}
                  label={svc.name}
                  value={svc.amountCents != null ? formatPrice(svc.amountCents / 100) : svc.price != null ? formatPrice(svc.price) : 'Consultar'}
                />
              ))}
              <Row label="Profissional" value={professional.name} />
              <Row
                label="Data"
                value={new Date(`${date}T12:00:00`).toLocaleDateString('pt-BR', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                })}
              />
              <Row label="Horário" value={timeSlot} highlight />
            </div>
          )}

          {/* ── ERRO ── */}
          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          {/* ── CONFIRMAR ── */}
          {professional?.isWalkIn ? (
            <button
              onClick={onClose}
              className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-4 rounded-xl transition-all duration-150 text-base active:scale-[0.98]"
            >
              Entendido →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || submitting}
              className="w-full bg-[#f97316] hover:bg-[#ea6c00] disabled:bg-[#f97316]/25 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all duration-150 text-base active:scale-[0.98]"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Confirmando...
                </span>
              ) : (
                'Confirmar Agendamento'
              )}
            </button>
          )}

          {/* Bottom safe area */}
          <div className="h-2" />
        </div>
      </div>
    </div>
  )
}

function SectionLabel({ step, label, done }: { step: number; label: string; done: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${
          done ? 'bg-[#22c55e] text-white' : 'bg-white/10 text-[#9ca3af]'
        }`}
      >
        {done ? (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          step
        )}
      </span>
      <p className="text-white font-semibold text-sm">{label}</p>
    </div>
  )
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[#9ca3af]">{label}</span>
      <span className={highlight ? 'text-[#22c55e] font-bold' : 'text-white font-medium'}>{value}</span>
    </div>
  )
}
