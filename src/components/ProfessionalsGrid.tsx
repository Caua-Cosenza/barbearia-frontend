import { useReveal } from '../hooks/useReveal'
import type { Professional } from '../types'

const PROFESSIONAL_PHOTOS: Record<string, string> = {
  'Jhonatan Correa': '/jhonatan.jpeg?v=2',
  'Sandro Santos': '/sandro.jpeg',
}

interface ProfessionalsGridProps {
  professionals: Professional[]
  loading: boolean
  onBook: (professional: Professional) => void
}

export default function ProfessionalsGrid({ professionals, loading, onBook }: ProfessionalsGridProps) {
  const ref = useReveal()

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-44 bg-[#1a1a2e] rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  if (!professionals.length) {
    return (
      <div className="text-center py-16">
        <p className="text-[#9ca3af]">Nenhum profissional disponível no momento.</p>
      </div>
    )
  }

  return (
    <div ref={ref} className="reveal grid grid-cols-2 sm:grid-cols-3 gap-4 py-4">
      {professionals.map((pro) => {
        const photoSrc = PROFESSIONAL_PHOTOS[pro.name] ?? pro.photoUrl
        return (
          <button
            key={pro.id}
            onClick={() => onBook(pro)}
            className="bg-[#1a1a2e] hover:bg-[#1e2242] border border-white/5 hover:border-[#2563eb]/40 rounded-xl p-4 flex flex-col items-center gap-3 text-center transition-all duration-200 md:hover:scale-[1.02] active:scale-[0.98] group"
          >
            {/* Avatar */}
            <div className="relative">
              {photoSrc ? (
                <img
                  src={photoSrc}
                  alt={pro.name}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-white/10 group-hover:ring-[#2563eb]/50 transition-all duration-200"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2563eb]/30 to-[#f97316]/30 flex items-center justify-center ring-2 ring-white/10 group-hover:ring-[#2563eb]/50 transition-all duration-200">
                  <span className="text-xl font-bold text-white">{pro.name[0]}</span>
                </div>
              )}
              {/* Online dot */}
              <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-[#22c55e] border-2 border-[#1a1a2e]" />
            </div>

            <div className="w-full">
              <p className="text-white font-semibold text-sm leading-tight">{pro.name}</p>
              {pro.bio && (
                <p className="text-[#9ca3af] text-xs mt-1 leading-relaxed">{pro.bio}</p>
              )}
            </div>

            <span className="text-[#2563eb] group-hover:text-[#3b82f6] text-xs font-semibold transition-colors">
              Ver horários →
            </span>
          </button>
        )
      })}
    </div>
  )
}
