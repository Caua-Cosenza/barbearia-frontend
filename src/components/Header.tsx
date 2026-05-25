import { useState } from 'react'

const TAB_MAP: Record<string, string> = {
  '#servicos': 'servicos',
  '#profissionais': 'profissionais',
  '#avaliacoes': 'avaliacoes',
}

function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, href: string, onClose?: () => void) {
  e.preventDefault()
  const tab = TAB_MAP[href]
  if (tab) globalThis.dispatchEvent(new CustomEvent('switchTab', { detail: tab }))
  const el = document.querySelector(href)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
  onClose?.()
}

const NAV_LINKS = [
  { label: 'Início', href: '#inicio' },
  { label: 'Serviços', href: '#servicos' },
  { label: 'Profissionais', href: '#profissionais' },
  { label: 'Avaliações', href: '#avaliacoes' },
  { label: 'Contato', href: '#contato' },
]

interface HeaderProps {
  onBook: () => void
}

export default function Header({ onBook }: HeaderProps) {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-[#0f0f0f]/95 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <a href="#inicio" className="flex items-center gap-2 shrink-0">
          <img src="/logo-jc.png" alt="JC" className="h-10 w-auto object-contain" />
          <span className="text-white font-bold text-lg tracking-tight">Jhonatan Correa</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[#9ca3af] hover:text-white text-sm font-medium transition-colors duration-150"
              onClick={(e) => handleNavClick(e, l.href)}
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <button
          onClick={onBook}
          className="hidden md:inline-flex items-center gap-1.5 bg-[#f97316] hover:bg-[#ea6c00] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors duration-150 shrink-0"
        >
          Agendar Agora
        </button>

        {/* Hamburger */}
        <button
          className="md:hidden text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
        >
          {open ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#1a1a2e] border-t border-white/5 animate-fade-in">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="block px-4 py-3 text-[#9ca3af] hover:text-white hover:bg-white/5 text-sm font-medium transition-colors"
              onClick={(e) => handleNavClick(e, l.href, () => setOpen(false))}
            >
              {l.label}
            </a>
          ))}
          <div className="p-4 border-t border-white/5">
            <button
              onClick={() => { setOpen(false); onBook() }}
              className="w-full bg-[#f97316] hover:bg-[#ea6c00] text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Agendar Agora
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
