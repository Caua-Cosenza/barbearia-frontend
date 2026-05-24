import { useState, useEffect } from 'react'
import { api } from '../../api/endpoints'
import { LoadingSpinner } from '../shared/LoadingSpinner'
import { ErrorMessage } from '../shared/ErrorMessage'
import type { Professional } from '../../types'

const PROFESSIONAL_PHOTOS: Record<string, string> = {
  'Jhonatan Correa': '/jhonatan.jpeg',
}

interface Props {
  selected: Professional | null
  onSelect: (p: Professional) => void
  onNext: () => void
  onWalkInDone?: () => void
}

export default function Step1Professional({
  selected,
  onSelect,
  onNext,
  onWalkInDone,
}: Readonly<Props>) {
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showWalkInInfo, setShowWalkInInfo] = useState(false)

  useEffect(() => {
    api.professionals
      .list()
      .then((res) => {
        if (res.success && res.data) setProfessionals(res.data)
        else setError(res.error ?? 'Erro ao carregar profissionais')
      })
      .catch(() => setError('Não foi possível carregar os profissionais'))
      .finally(() => setLoading(false))
  }, [])

  function handleSelect(p: Professional) {
    onSelect(p)
    setShowWalkInInfo(p.isWalkIn === true)
  }

  function handleWalkInDone() {
    if (onWalkInDone) {
      onWalkInDone()
    } else {
      setShowWalkInInfo(false)
    }
  }

  if (loading) return <LoadingSpinner />

  // Walk-in info panel — shown after selecting a walk-in professional
  if (showWalkInInfo && selected?.isWalkIn) {
    return (
      <div className="py-2">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <span className="text-3xl" aria-hidden="true">✂️</span>
          <div>
            <h2 className="text-lg font-bold text-white leading-tight">
              Atendimento por Ordem de Chegada
            </h2>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30 mt-1">
              Ordem de chegada
            </span>
          </div>
        </div>

        {/* Main card */}
        <div className="bg-zinc-900 border border-amber-500/30 rounded-2xl p-5 mb-5 space-y-5">
          {/* Professional info */}
          <div>
            <p className="text-white font-semibold text-base">{selected.name}</p>
            {selected.bio && (
              <p className="text-gray-400 text-sm mt-0.5">{selected.bio}</p>
            )}
          </div>

          <div className="h-px bg-amber-500/15" />

          {/* How it works */}
          <div>
            <p className="text-gray-300 text-sm font-semibold mb-3">Como funciona:</p>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3">
                <span className="text-lg leading-none mt-0.5 shrink-0" aria-hidden="true">📍</span>
                <div>
                  <p className="text-white text-sm font-medium">Compareça à barbearia</p>
                  <p className="text-gray-500 text-xs mt-0.5">no horário de funcionamento</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-lg leading-none mt-0.5 shrink-0" aria-hidden="true">⏱️</span>
                <div>
                  <p className="text-white text-sm font-medium">Aguarde na fila de chegada</p>
                  <p className="text-gray-500 text-xs mt-0.5">Sem necessidade de agendamento</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-lg leading-none mt-0.5 shrink-0" aria-hidden="true">💈</span>
                <div>
                  <p className="text-white text-sm font-medium">Horário de funcionamento:</p>
                  <div className="mt-1.5 space-y-0.5 text-xs text-gray-400 font-mono">
                    <p>Ter–Sáb:&nbsp;&nbsp;08:20 – 19:00</p>
                    <p>Dom–Seg:&nbsp;&nbsp;Fechado</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => setShowWalkInInfo(false)}
            className="flex-1 px-5 py-3 rounded-xl font-medium text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 transition-all duration-200 text-sm"
          >
            ← Escolher outro profissional
          </button>
          <button
            type="button"
            onClick={handleWalkInDone}
            className="flex-1 px-5 py-3 rounded-xl font-bold text-black bg-amber-500 hover:bg-amber-400 shadow-lg shadow-amber-500/25 hover:-translate-y-0.5 transition-all duration-200 text-sm"
          >
            Entendido →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-6">Escolha o Profissional</h2>

      <ErrorMessage message={error} />

      {!error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {professionals.map((p) => {
            const isSelected = selected?.id === p.id
            const isWalkIn = p.isWalkIn === true
            const photoSrc = PROFESSIONAL_PHOTOS[p.name] ?? p.photoUrl
            let cardBorder = 'border-gray-700 bg-gray-800 hover:border-gray-600'
            if (isSelected) {
              cardBorder = isWalkIn
                ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500/20'
                : 'border-violet-500 bg-violet-900/20 ring-1 ring-violet-500/30'
            }
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelect(p)}
                className={`p-5 rounded-xl border-2 text-left transition-all duration-200 ${cardBorder}`}
              >
                {/* Avatar */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center text-xl font-bold text-white mb-3 overflow-hidden flex-shrink-0">
                  {photoSrc ? (
                    <img src={photoSrc} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    p.name.charAt(0).toUpperCase()
                  )}
                </div>

                {/* Name + walk-in badge */}
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-semibold text-white text-base">{p.name}</h3>
                  {isWalkIn && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      Ordem de chegada
                    </span>
                  )}
                </div>

                {/* Bio or walk-in info */}
                {isWalkIn ? (
                  <p className="text-amber-400/80 text-xs mt-1 leading-relaxed">
                    Atende por ordem de chegada. Compareça à barbearia sem precisar agendar horário.
                  </p>
                ) : (
                  p.bio && <p className="text-gray-400 text-sm mt-1 line-clamp-2">{p.bio}</p>
                )}

                {isSelected && !isWalkIn && (
                  <span className="mt-2 inline-flex items-center gap-1 text-violet-400 text-sm font-medium">
                    ✓ Selecionado
                  </span>
                )}
                {isSelected && isWalkIn && (
                  <span className="mt-2 inline-flex items-center gap-1 text-amber-400 text-sm font-medium">
                    ✓ Selecionado
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onNext}
          disabled={!selected || selected.isWalkIn === true}
          className={[
            'px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200',
            selected && !selected.isWalkIn
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
