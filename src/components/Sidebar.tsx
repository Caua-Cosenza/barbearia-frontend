import { useReveal } from '../hooks/useReveal'

const HOURS = [
  { day: 'Terça – Sábado', hours: '08:20 – 19:00', closed: false },
  { day: 'Segunda e Domingo', hours: 'Fechado', closed: true },
]

const PAYMENT_METHODS = ['Pix', 'Débito', 'Crédito', 'Dinheiro']

const WHATSAPP_HREF = 'https://wa.me/5522992718402'
const INSTAGRAM_HREF = 'https://www.instagram.com/barbershop.correa/'

export default function Sidebar() {
  const ref = useReveal<HTMLElement>()

  return (
    <aside ref={ref} className="reveal space-y-4" id="contato">
      {/* Location */}
      <div className="bg-[#1a1a2e] rounded-xl p-4 border border-white/5">
        <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-[#f97316] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Localização
        </h3>
        <p className="text-[#9ca3af] text-sm leading-relaxed">
          R. Oscár Clark, 151<br />
          Centro – Araruama, RJ<br />
          CEP 28970-000
        </p>
        <a
          href="https://www.google.com/maps/place/Barbearia+Jhonatan+Correa/@-22.8685777,-42.3406014,17z/data=!4m15!1m8!3m7!1s0x976939c4ffe4f7:0x8bf083fc6874ff98!2sR.+Osc%C3%A1r+Clark,+151+-+Centro,+Araruama+-+RJ,+28979-717!3b1!8m2!3d-22.8685777!4d-42.3380265!16s%2Fg%2F11v0_4_vjs!3m5!1s0x9769436aa1ffff:0xde219cc95f45d03d!8m2!3d-22.8685777!4d-42.3380265!16s%2Fg%2F11ybp0kbw_?entry=ttu"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[#2563eb] hover:text-[#3b82f6] text-xs mt-2.5 transition-colors"
        >
          Ver no mapa
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      {/* Hours */}
      <div className="bg-[#1a1a2e] rounded-xl p-4 border border-white/5">
        <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-[#f97316] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Horário de Atendimento
        </h3>
        <div className="space-y-2">
          {HOURS.map((item) => (
            <div key={item.day} className="flex justify-between items-center text-sm">
              <span className="text-[#9ca3af]">{item.day}</span>
              <span className={item.closed ? 'text-red-400 font-medium' : 'text-white font-medium'}>
                {item.hours}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Payment */}
      <div className="bg-[#1a1a2e] rounded-xl p-4 border border-white/5">
        <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-[#f97316] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          Formas de Pagamento
        </h3>
        <div className="flex flex-wrap gap-2">
          {PAYMENT_METHODS.map((method) => (
            <span
              key={method}
              className="bg-white/5 border border-white/8 text-[#9ca3af] text-xs px-2.5 py-1 rounded-full"
            >
              {method}
            </span>
          ))}
        </div>
      </div>

      {/* Social + Contact */}
      <div className="bg-[#1a1a2e] rounded-xl p-4 border border-white/5">
        <h3 className="text-white font-semibold text-sm mb-3">Redes Sociais</h3>
        <div className="flex gap-2 flex-wrap">
          {/* Instagram */}
          <a
            href={INSTAGRAM_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-[#9ca3af] hover:text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
            Instagram
          </a>

          {/* WhatsApp */}
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-[#22c55e]/10 hover:bg-[#22c55e]/20 text-[#22c55e] px-3 py-2 rounded-lg text-xs font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </a>
        </div>
      </div>
    </aside>
  )
}
