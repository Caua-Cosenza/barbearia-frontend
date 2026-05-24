import { useState } from 'react'
import type { Service } from '../types'

const DEFAULT_VISIBLE = 5

function formatPrice(amountCents: number | null | undefined, price: number | null | undefined): string {
  if (amountCents != null) {
    return (amountCents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }
  if (price != null) {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }
  return 'Consultar'
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}min` : `${h}h`
}

interface ServicesListProps {
  services: Service[]
  loading: boolean
  onBook: (service: Service) => void
  error?: string | null
  onRetry?: () => void
}

export default function ServicesList({ services, loading, onBook, error, onRetry }: ServicesListProps) {
  const [expanded, setExpanded] = useState(false)

  if (loading) {
    return (
      <div className="space-y-px">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-[72px] bg-[#1a1a2e]/60 animate-pulse rounded-xl" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16 space-y-3">
        <p className="text-[#9ca3af]">Não foi possível carregar os serviços.</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 border border-[#f97316]/60 text-[#f97316] hover:bg-[#f97316]/10 text-sm font-semibold px-5 py-2.5 rounded-lg transition-all duration-150"
          >
            Tentar novamente
          </button>
        )}
      </div>
    )
  }

  if (!services.length) {
    return (
      <div className="text-center py-16">
        <p className="text-[#9ca3af]">Nenhum serviço disponível no momento.</p>
      </div>
    )
  }

  const visible = expanded ? services : services.slice(0, DEFAULT_VISIBLE)
  const hasMore = services.length > DEFAULT_VISIBLE

  return (
    <div>
      <div className="divide-y divide-white/5">
        {visible.map((service) => (
          <div
            key={service.id}
            className="flex items-center gap-3 sm:gap-4 py-4 -mx-2 px-2 rounded-xl hover:bg-white/[0.02] transition-colors duration-150 group"
          >
            {/* Scissors icon */}
            <div className="w-10 h-10 rounded-xl bg-[#1a1a2e] border border-white/5 flex items-center justify-center shrink-0 group-hover:border-[#f97316]/30 transition-colors">
              <svg className="w-5 h-5 text-[#f97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243zm2.122-8.485a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
              </svg>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm sm:text-base truncate">{service.name}</p>
              <div className="flex items-center gap-3 mt-0.5">
                {service.description && (
                  <p className="text-[#9ca3af] text-xs truncate hidden sm:block">{service.description}</p>
                )}
                <span className="flex items-center gap-1 text-[#9ca3af] text-xs whitespace-nowrap">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formatDuration(service.durationMinutes)}
                </span>
              </div>
            </div>

            {/* Price */}
            <span className="text-white font-bold text-sm sm:text-base whitespace-nowrap shrink-0">
              {formatPrice(service.amountCents, service.price)}
            </span>

            {/* Button */}
            <button
              onClick={() => onBook(service)}
              className="shrink-0 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-semibold px-3 sm:px-4 py-2 rounded-lg transition-all duration-150 md:hover:scale-105 active:scale-95 whitespace-nowrap"
            >
              Agendar
            </button>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex items-center gap-2 border border-[#f97316]/60 text-[#f97316] hover:bg-[#f97316]/10 text-sm font-semibold px-5 py-2.5 rounded-lg transition-all duration-150"
          >
            {expanded ? (
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
    </div>
  )
}
