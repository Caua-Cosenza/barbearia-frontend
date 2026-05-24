export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-zinc-800 py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Logo e nome */}
        <div className="flex items-center gap-3">
          <img src="/logo-jc.png" alt="JC" className="h-8 w-auto" />
          <span className="text-white font-semibold">Barbearia Jhonatan Correa</span>
        </div>

        {/* Localização */}
        <div className="text-zinc-400 text-sm text-center md:text-left">
          <p>R. Oscár Clark, 151 - Centro, Araruama - RJ</p>
          <p>CEP 28970-000</p>
        </div>

        {/* Redes sociais */}
        <div className="flex items-center gap-4">
          <a
            href="https://wa.me/5522992718402"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-green-400 hover:text-green-300 transition text-sm"
          >
            <span>📱</span> WhatsApp
          </a>
          <a
            href="https://www.instagram.com/barbershop.correa/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-pink-400 hover:text-pink-300 transition text-sm"
          >
            <span>📷</span> Instagram
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-6 pt-4 border-t border-zinc-800 text-center">
        <p className="text-zinc-600 text-xs">© 2026 Barbearia Jhonatan Correa. Todos os direitos reservados.</p>
      </div>
    </footer>
  )
}
