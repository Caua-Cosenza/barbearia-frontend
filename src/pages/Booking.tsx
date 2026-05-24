import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProgressBar from '../components/ProgressBar'
import Step1Professional from '../components/steps/Step1Professional'
import Step2Service from '../components/steps/Step2Service'
import Step3DateTime from '../components/steps/Step3DateTime'
import Step4Confirm from '../components/steps/Step4Confirm'
import { api } from '../api/endpoints'
import type { BookingWizardState } from '../types'

const INITIAL_STATE: BookingWizardState = {
  professional: null,
  services: [],
  date: null,
  timeSlot: null,
  customerName: '',
  customerPhone: '',
  customerEmail: '',
}

export function Booking() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [state, setState] = useState<BookingWizardState>(INITIAL_STATE)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  function next() { setStep((s) => Math.min(s + 1, 4)); setSubmitError(null) }
  function back() { setStep((s) => Math.max(s - 1, 1)); setSubmitError(null) }

  async function handleSubmit() {
    if (!state.professional || state.services.length === 0 || !state.date || !state.timeSlot) return

    setSubmitting(true)
    setSubmitError(null)
    try {
      const res = await api.appointments.createPublic({
        professionalId: state.professional.id,
        serviceIds: state.services.map((s) => s.id),
        scheduledAt: `${state.date}T${state.timeSlot}:00`,
        guestName: state.customerName.trim(),
        guestPhone: state.customerPhone.trim(),
        ...(state.customerEmail.trim() ? { guestEmail: state.customerEmail.trim() } : {}),
      })

      if (res.success && res.data) {
        navigate('/booking/confirmation', { state: { appointment: res.data, bookingInfo: state } })
      } else {
        setSubmitError(res.error ?? res.message ?? 'Erro ao criar agendamento')
      }
    } catch {
      setSubmitError('Não foi possível criar o agendamento. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Agendar Horário</h1>
          <p className="text-gray-400">Escolha seu profissional e serviço preferido</p>
        </div>

        <ProgressBar currentStep={step} />

        {step === 1 && (
          <Step1Professional
            selected={state.professional}
            onSelect={(p) => setState((s) => ({ ...s, professional: p }))}
            onNext={next}
            onWalkInDone={() => navigate('/')}
          />
        )}

        {step === 2 && (
          <Step2Service
            selected={state.services}
            onSelect={(svs) => setState((s) => ({ ...s, services: svs, date: null, timeSlot: null }))}
            onNext={next}
            onBack={back}
          />
        )}

        {step === 3 && state.professional && (
          <Step3DateTime
            professional={state.professional}
            serviceId={state.services[0]?.id ?? ''}
            selectedDate={state.date}
            selectedTimeSlot={state.timeSlot}
            onSelectDate={(d) => setState((s) => ({ ...s, date: d, timeSlot: null }))}
            onSelectTimeSlot={(t) => setState((s) => ({ ...s, timeSlot: t }))}
            onNext={next}
            onBack={back}
          />
        )}

        {step === 4 && (
          <Step4Confirm
            state={state}
            onChangeField={(field, value) => setState((s) => ({ ...s, [field]: value }))}
            onBack={back}
            onSubmit={handleSubmit}
            submitting={submitting}
            error={submitError}
          />
        )}
      </div>
    </div>
  )
}
