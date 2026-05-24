import { useReveal } from '../hooks/useReveal'

const REVIEWS = [
  {
    id: 1,
    name: 'Carlos Mendes',
    rating: 5,
    date: '12/04/2025',
    comment: 'Excelente atendimento! O corte ficou incrível e o ambiente é muito agradável. Com certeza voltarei!',
    service: 'Corte + Barba',
  },
  {
    id: 2,
    name: 'Lucas Ferreira',
    rating: 5,
    date: '08/04/2025',
    comment: 'Profissionais muito qualificados. Fiz a micropigmentação e ficou muito natural. Recomendo a todos!',
    service: 'Micropigmentação',
  },
  {
    id: 3,
    name: 'Rafael Oliveira',
    rating: 5,
    date: '02/04/2025',
    comment: 'Melhor barbearia da região sem dúvida. Preço justo, qualidade top e agendamento super fácil!',
    service: 'Corte Degradê',
  },
  {
    id: 4,
    name: 'Pedro Costa',
    rating: 4,
    date: '28/03/2025',
    comment: 'Ótimo serviço, profissional muito atencioso. O resultado ficou acima das expectativas.',
    service: 'Barba',
  },
  {
    id: 5,
    name: 'Marcos Silva',
    rating: 5,
    date: '22/03/2025',
    comment: 'Atendimento excepcional, profissionais super treinados. Já é minha barbearia de cabeceira faz 2 anos!',
    service: 'Corte + Barba',
  },
  {
    id: 6,
    name: 'André Souza',
    rating: 5,
    date: '15/03/2025',
    comment: 'Fui indicado por amigos e não me arrependi. Corte impecável, ambiente ótimo e preço muito bom!',
    service: 'Corte Social',
  },
]

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${i <= rating ? 'text-yellow-400' : 'text-white/15'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function ReviewsList() {
  const ref = useReveal()
  const totalRatings = REVIEWS.length
  const avgRating = (REVIEWS.reduce((s, r) => s + r.rating, 0) / totalRatings).toFixed(1)

  return (
    <div ref={ref} className="reveal py-4 space-y-6">
      {/* Summary card */}
      <div className="bg-[#1a1a2e] border border-white/5 rounded-xl p-5 flex items-center gap-5">
        <div className="text-center shrink-0">
          <p className="text-5xl font-extrabold text-white leading-none">{avgRating}</p>
          <Stars rating={5} />
          <p className="text-[#9ca3af] text-xs mt-1.5">{totalRatings} avaliações</p>
        </div>
        <div className="flex-1 space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = REVIEWS.filter((r) => r.rating === star).length
            const pct = Math.round((count / totalRatings) * 100)
            return (
              <div key={star} className="flex items-center gap-2">
                <span className="text-[#9ca3af] text-xs w-2.5 text-right">{star}</span>
                <div className="flex-1 h-1.5 bg-white/8 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-[#9ca3af] text-xs w-4 text-right">{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Reviews grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {REVIEWS.map((review) => (
          <div
            key={review.id}
            className="bg-[#1a1a2e] border border-white/5 hover:border-white/10 rounded-xl p-4 transition-colors duration-150"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2563eb]/40 to-[#f97316]/40 flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-sm">{review.name[0]}</span>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold leading-tight">{review.name}</p>
                  <p className="text-[#9ca3af] text-xs">{review.service}</p>
                </div>
              </div>
              <p className="text-[#9ca3af] text-xs whitespace-nowrap shrink-0">{review.date}</p>
            </div>
            <Stars rating={review.rating} />
            <p className="text-[#9ca3af] text-sm mt-2 leading-relaxed">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
