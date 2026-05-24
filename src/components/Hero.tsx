import { useReveal } from '../hooks/useReveal'

interface HeroProps {
  onBook: () => void
}

export default function Hero({ onBook }: HeroProps) {
  const ref = useReveal()

  return (
    <section
      id="inicio"
      className="relative pt-16 min-h-[580px] flex items-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#0f0f0f]/90 to-[#0f0f0f]" />
      {/* Glow accent */}
      <div className="absolute -top-20 left-1/4 w-96 h-96 bg-[#f97316]/8 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-[#2563eb]/6 blur-[80px] rounded-full pointer-events-none" />
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Logo background watermark */}
      <img
        src="/logo-jc.png"
        alt=""
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-contain opacity-[0.08] pointer-events-none select-none z-0 w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] md:w-[550px] md:h-[550px] lg:w-[700px] lg:h-[700px]"
      />

      <div ref={ref} className="reveal relative z-10 max-w-7xl mx-auto px-4 w-full py-20">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-orange-400 text-sm font-medium">Agendamento online disponível</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-5 leading-[1.08] tracking-tight">
            Barbearia<br />
            <span className="text-zinc-200">Jhonatan Correa</span>
          </h1>

          <p className="text-[#9ca3af] text-lg sm:text-xl mb-8 leading-relaxed max-w-lg">
            Profissionais especializados, atendimento de excelência.
            Agende em segundos, sem sair de casa.
          </p>

          <button
            onClick={onBook}
            className="inline-flex items-center gap-2 bg-[#f97316] hover:bg-[#ea6c00] text-white font-bold text-lg px-8 py-4 rounded-xl transition-all duration-200 shadow-2xl shadow-[#f97316]/20 hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
          >
            Agendar Agora
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/5">
            {[
              { value: '500+', label: 'Clientes atendidos' },
              { value: '5.0★', label: 'Avaliação média' },
              { value: '2', label: 'Profissionais' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-white font-extrabold text-2xl leading-tight">{stat.value}</p>
                <p className="text-[#9ca3af] text-xs mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
