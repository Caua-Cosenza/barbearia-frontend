import { useNavigate } from 'react-router-dom'

const SECTIONS = [
  {
    title: '1. Dados que Coletamos',
    body: 'Ao realizar um agendamento, coletamos:',
    list: [
      'Nome completo',
      'Número de telefone/WhatsApp',
    ],
    footer: 'Não coletamos dados sensíveis, informações financeiras, localização ou dados de menores de idade.',
  },
  {
    title: '2. Finalidade do Uso',
    body: 'Seus dados são utilizados exclusivamente para:',
    list: [
      'Confirmar e gerenciar seu agendamento',
      'Enviar lembretes via WhatsApp',
      'Possibilitar o cancelamento do agendamento',
      'Contato em caso de alterações no horário',
    ],
  },
  {
    title: '3. Base Legal',
    body: 'O tratamento dos seus dados é realizado com base no seu consentimento (Art. 7º, I da LGPD), fornecido ao confirmar o agendamento.',
  },
  {
    title: '4. Compartilhamento',
    body: 'Seus dados NÃO são vendidos, alugados ou compartilhados com terceiros para fins de marketing. O número de telefone é utilizado apenas para envio de mensagens via WhatsApp (plataforma da Meta) relacionadas ao seu agendamento.',
  },
  {
    title: '5. Armazenamento e Segurança',
    list: [
      'Seus dados são armazenados em servidores seguros com criptografia AES-256',
      'O acesso é restrito ao administrador da barbearia',
      'Utilizamos HTTPS em todas as comunicações',
      'Senhas são protegidas com hash bcrypt',
    ],
  },
  {
    title: '6. Retenção',
    body: 'Mantemos seus dados de agendamento por até 12 meses após o último agendamento. Após esse período, os dados são automaticamente excluídos.',
  },
  {
    title: '7. Seus Direitos',
    body: 'Conforme a LGPD, você tem direito a:',
    list: [
      'Confirmar a existência de tratamento dos seus dados',
      'Acessar seus dados pessoais',
      'Corrigir dados incompletos ou desatualizados',
      'Solicitar a exclusão dos seus dados',
      'Revogar o consentimento',
    ],
  },
  {
    title: '8. Como Exercer Seus Direitos',
    body: 'Para solicitar acesso, correção ou exclusão dos seus dados, entre em contato:',
    contact: true,
  },
  {
    title: '9. Cookies',
    body: 'Este site utiliza apenas cookies essenciais para autenticação do painel administrativo. Não utilizamos cookies de rastreamento, analytics ou publicidade.',
  },
  {
    title: '10. Alterações',
    body: 'Esta política pode ser atualizada periodicamente. Alterações significativas serão comunicadas no site.',
  },
]

export default function PrivacyPolicy() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0f0f0f]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-2 shrink-0">
            <img src="/logo-jc.png" alt="JC" className="h-9 w-auto object-contain" />
            <span className="text-white font-bold text-base tracking-tight hidden sm:block">Jhonatan Correa</span>
          </a>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-white text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Voltar ao início
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-10 pb-20">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Política de Privacidade</h1>
          <p className="text-zinc-500 text-sm">Última atualização: 26 de maio de 2026</p>
        </div>

        <p className="text-zinc-300 text-sm leading-relaxed mb-10">
          A Barbearia Jhonatan Correa ("nós") valoriza a privacidade dos seus clientes. Esta política explica
          como coletamos, usamos e protegemos seus dados pessoais, em conformidade com a Lei Geral de
          Proteção de Dados (LGPD — Lei nº 13.709/2018).
        </p>

        <div className="space-y-8">
          {SECTIONS.map((section) => (
            <section key={section.title} className="border-t border-white/5 pt-6">
              <h2 className="text-white font-semibold text-base mb-3">{section.title}</h2>
              {section.body && (
                <p className="text-zinc-300 text-sm leading-relaxed mb-3">{section.body}</p>
              )}
              {section.list && (
                <ul className="space-y-1.5 mb-3">
                  {section.list.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-zinc-300 text-sm">
                      <span className="text-[#f97316] mt-0.5 shrink-0">–</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              {section.footer && (
                <p className="text-zinc-400 text-sm leading-relaxed">{section.footer}</p>
              )}
              {section.contact && (
                <div className="bg-[#1a1a2e] rounded-xl p-4 border border-white/5 space-y-2 text-sm mt-3">
                  <p className="text-zinc-300">
                    <span className="text-zinc-500">WhatsApp: </span>
                    <a href="https://wa.me/5522992718402" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 transition-colors">
                      (22) 99271-8402
                    </a>
                  </p>
                  <p className="text-zinc-300">
                    <span className="text-zinc-500">Responsável: </span>Jhonatan Correa
                  </p>
                  <p className="text-zinc-300">
                    <span className="text-zinc-500">Endereço: </span>R. Oscár Clark, 151 - Centro, Araruama - RJ
                  </p>
                  <p className="text-zinc-400 text-xs mt-2">Responderemos sua solicitação em até 15 dias úteis.</p>
                </div>
              )}
            </section>
          ))}
        </div>
      </main>
    </div>
  )
}
