import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/endpoints'
import type { CancelPageData } from '../types'

// ── Formatters ────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  const d = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso))
  return d.charAt(0).toUpperCase() + d.slice(1)
}

function formatTime(iso: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

function formatCents(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}min` : `${h}h`
}

// ── Shared UI ─────────────────────────────────────────────────────────────────

function Shell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">{children}</div>
    </div>
  )
}

function BackToHome() {
  return (
    <Link
      to="/"
      className="flex items-center justify-center w-full border border-zinc-600 text-zinc-400 hover:text-white hover:border-zinc-400 font-semibold py-3 rounded-xl transition-all duration-150"
    >
      Voltar ao início
    </Link>
  )
}

function IconCircle({
  bg,
  children,
}: Readonly<{ bg: string; children: React.ReactNode }>) {
  return (
    <div className={`w-20 h-20 rounded-full ${bg} flex items-center justify-center mx-auto mb-5`}>
      {children}
    </div>
  )
}

function CheckIcon({ className }: Readonly<{ className: string }>) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function XIcon({ className }: Readonly<{ className: string }>) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

// ── Appointment summary card ──────────────────────────────────────────────────

function AppointmentCard({ data }: Readonly<{ data: CancelPageData }>) {
  return (
    <div className="bg-zinc-900 border border-white/8 rounded-2xl p-5 mb-5">
      <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-4">
        Resumo do agendamento
      </p>
      <dl className="space-y-2.5 text-sm">
        <Row label="Cliente" value={data.guestName} />
        <Row label="Data" value={formatDate(data.scheduledAt)} />
        <Row label="Horário" value={formatTime(data.scheduledAt)} highlight />

        {data.services.length > 0 && (
          <>
            <div className="h-px bg-white/8 my-1" />
            {data.services.map((s) => (
              <div key={s.name} className="flex justify-between items-center">
                <dt className="text-zinc-400">{s.name}</dt>
                <dd className="text-white font-medium">{formatCents(s.amountCents)}</dd>
              </div>
            ))}
            <div className="h-px bg-white/8 my-1" />
            <div className="flex justify-between items-center font-semibold">
              <dt className="text-zinc-300">Total</dt>
              <dd className="text-white">{formatCents(data.totalAmountCents)}</dd>
            </div>
            <div className="flex justify-between items-center text-xs">
              <dt className="text-zinc-500">Duração total</dt>
              <dd className="text-zinc-400">{formatDuration(data.totalDurationMinutes)}</dd>
            </div>
          </>
        )}
      </dl>
    </div>
  )
}

function Row({
  label,
  value,
  highlight,
}: Readonly<{ label: string; value: string; highlight?: boolean }>) {
  return (
    <div className="flex justify-between items-start gap-4">
      <dt className="text-zinc-400 shrink-0">{label}</dt>
      <dd className={`font-medium text-right ${highlight ? 'text-[#22c55e]' : 'text-white'}`}>
        {value}
      </dd>
    </div>
  )
}

// ── Page component ────────────────────────────────────────────────────────────

export function Cancel() {
  const { token } = useParams<{ token: string }>()

  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [data, setData] = useState<CancelPageData | null>(null)
  const [confirming, setConfirming] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [cancelled, setCancelled] = useState(false)
  const [cancelError, setCancelError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) { setNotFound(true); setLoading(false); return }
    api.cancel.get(token)
      .then((res) => {
        if (res.success && res.data) setData(res.data)
        else setNotFound(true)
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [token])

  async function handleCancel() {
    if (!token) return
    setCancelling(true)
    setCancelError(null)
    try {
      const res = await api.cancel.cancel(token)
      if (res.success) {
        setCancelled(true)
        setConfirming(false)
      } else {
        setCancelError(res.error ?? 'Erro ao cancelar agendamento')
      }
    } catch {
      setCancelError('Não foi possível cancelar. Tente novamente.')
    } finally {
      setCancelling(false)
    }
  }

  // 1. Loading
  if (loading) {
    return (
      <Shell>
        <div className="flex justify-center py-16">
          <svg className="w-10 h-10 text-zinc-600 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      </Shell>
    )
  }

  // 2. Token inválido / não encontrado
  if (notFound || !data) {
    return (
      <Shell>
        <div className="text-center mb-8">
          <IconCircle bg="bg-red-500/15 border border-red-500/30">
            <XIcon className="w-10 h-10 text-red-400" />
          </IconCircle>
          <h1 className="text-2xl font-extrabold text-white mb-2">Agendamento não encontrado</h1>
          <p className="text-zinc-400 text-sm">Este link é inválido ou já expirou.</p>
        </div>
        <BackToHome />
      </Shell>
    )
  }

  // 7. Cancelamento bem-sucedido
  if (cancelled) {
    return (
      <Shell>
        <div className="text-center mb-8">
          <IconCircle bg="bg-[#22c55e]/15 border border-[#22c55e]/30">
            <CheckIcon className="w-10 h-10 text-[#22c55e]" />
          </IconCircle>
          <h1 className="text-2xl font-extrabold text-white mb-2">Agendamento cancelado</h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Seu agendamento foi cancelado com sucesso.<br />
            O horário foi liberado. Esperamos vê-lo em breve! 💈
          </p>
        </div>
        <BackToHome />
      </Shell>
    )
  }

  // 3. Já cancelado
  if (data.status === 'CANCELLED') {
    return (
      <Shell>
        <div className="text-center mb-8">
          <IconCircle bg="bg-zinc-700/40 border border-zinc-600/40">
            <CheckIcon className="w-10 h-10 text-zinc-400" />
          </IconCircle>
          <h1 className="text-2xl font-extrabold text-white mb-2">Agendamento já cancelado</h1>
          <p className="text-zinc-400 text-sm">Este agendamento já foi cancelado anteriormente.</p>
        </div>
        <BackToHome />
      </Shell>
    )
  }

  // 4. Já concluído / no-show
  if (data.status === 'COMPLETED' || data.status === 'NO_SHOW') {
    return (
      <Shell>
        <div className="text-center mb-8">
          <IconCircle bg="bg-[#22c55e]/15 border border-[#22c55e]/30">
            <CheckIcon className="w-10 h-10 text-[#22c55e]" />
          </IconCircle>
          <h1 className="text-2xl font-extrabold text-white mb-2">Agendamento já realizado</h1>
          <p className="text-zinc-400 text-sm">Este agendamento já foi concluído.</p>
        </div>
        <BackToHome />
      </Shell>
    )
  }

  // 5. Prazo encerrado (canCancel = false)
  if (!data.canCancel) {
    return (
      <Shell>
        <AppointmentCard data={data} />
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 mb-6">
          <p className="text-amber-400 font-semibold text-sm mb-1">⏰ Prazo de cancelamento encerrado</p>
          <p className="text-zinc-400 text-sm leading-relaxed">
            O cancelamento só é permitido até 1 hora antes do horário.
            Para cancelar, entre em contato diretamente com a barbearia.
          </p>
        </div>
        <BackToHome />
      </Shell>
    )
  }

  // 6. Pode cancelar
  return (
    <Shell>
      <h1 className="text-xl font-bold text-white mb-5">Cancelar agendamento</h1>

      <AppointmentCard data={data} />

      <div className="bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-3 mb-6">
        <p className="text-zinc-400 text-sm">
          ⚠️ Após cancelar, o horário será liberado para outros clientes.
        </p>
      </div>

      {cancelError && (
        <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3 mb-4">
          {cancelError}
        </p>
      )}

      {confirming ? (
        // Confirmação inline
        <div className="space-y-3">
          <p className="text-white text-sm text-center font-medium mb-4">
            Tem certeza? Esta ação não pode ser desfeita.
          </p>
          <button
            type="button"
            onClick={handleCancel}
            disabled={cancelling}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all duration-150"
          >
            {cancelling ? 'Cancelando...' : 'Sim, cancelar'}
          </button>
          <button
            type="button"
            onClick={() => { setConfirming(false); setCancelError(null) }}
            disabled={cancelling}
            className="w-full border border-zinc-600 text-zinc-400 hover:text-white hover:border-zinc-400 font-semibold py-3 rounded-xl transition-all duration-150 disabled:opacity-50"
          >
            Não, voltar
          </button>
        </div>
      ) : (
        // Botões principais
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all duration-150"
          >
            Cancelar meu agendamento
          </button>
          <BackToHome />
        </div>
      )}
    </Shell>
  )
}
