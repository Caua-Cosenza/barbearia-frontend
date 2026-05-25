import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import ServicesList from '../components/ServicesList'
import ProfessionalsGrid from '../components/ProfessionalsGrid'
import ReviewsList from '../components/ReviewsList'
import Sidebar from '../components/Sidebar'
import BookingModal from '../components/BookingModal'
import Footer from '../components/Footer'
import { api } from '../api/endpoints'
import type { Service, Professional } from '../types'

type TabKey = 'servicos' | 'profissionais' | 'avaliacoes'

const TABS: { key: TabKey; label: string; anchor: string }[] = [
  { key: 'servicos', label: 'Serviços', anchor: 'servicos' },
  { key: 'profissionais', label: 'Profissionais', anchor: 'profissionais' },
  { key: 'avaliacoes', label: 'Avaliações', anchor: 'avaliacoes' },
]

interface ModalState {
  open: boolean
  service: Service | null
  professional: Professional | null
}

export function Home() {
  const [services, setServices] = useState<Service[]>([])
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [loadingServices, setLoadingServices] = useState(true)
  const [loadingProfessionals, setLoadingProfessionals] = useState(true)
  const [servicesError, setServicesError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabKey>('servicos')
  const [modal, setModal] = useState<ModalState>({ open: false, service: null, professional: null })

  function loadData() {
    setLoadingServices(true)
    setLoadingProfessionals(true)
    setServicesError(null)

    api.services.list()
      .then((res) => {
        const loaded = res.data ?? []
        setServices(loaded)
        if (!res.success || loaded.length === 0) {
          setServicesError(res.error ?? 'Serviços indisponíveis')
        }
      })
      .catch(() => setServicesError('Erro ao conectar com o servidor'))
      .finally(() => setLoadingServices(false))

    api.professionals.list()
      .then((res) => { setProfessionals(res.data ?? []) })
      .catch(console.error)
      .finally(() => setLoadingProfessionals(false))
  }

  useEffect(() => { loadData() }, [])

  useEffect(() => {
    function handleSwitchTab(e: CustomEvent) {
      const tab = e.detail as TabKey
      if (['servicos', 'profissionais', 'avaliacoes'].includes(tab)) setActiveTab(tab)
    }
    globalThis.addEventListener('switchTab', handleSwitchTab as EventListener)
    return () => globalThis.removeEventListener('switchTab', handleSwitchTab as EventListener)
  }, [])

  function openModal(opts?: { service?: Service; professional?: Professional }) {
    setModal({ open: true, service: opts?.service ?? null, professional: opts?.professional ?? null })
  }

  function closeModal() {
    setModal((s) => ({ ...s, open: false }))
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Header onBook={() => openModal()} />

      <Hero onBook={() => openModal()} />

      {/* Main content area */}
      <main className="max-w-7xl mx-auto px-4 pt-8 pb-24 lg:pb-12">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

          {/* Left column: tabs + content */}
          <div className="flex-1 min-w-0">

            {/* Tab bar */}
            <div
              id="servicos"
              className="flex border-b border-white/8 mb-1 sticky top-16 bg-[#0f0f0f] z-20 -mx-4 px-4"
            >
              {TABS.map((tab) => (
                <a
                  key={tab.key}
                  href={`#${tab.anchor}`}
                  id={tab.anchor}
                  onClick={(e) => { e.preventDefault(); setActiveTab(tab.key) }}
                  className={`px-4 py-3.5 text-sm font-semibold border-b-2 -mb-px transition-all duration-200 ${
                    activeTab === tab.key
                      ? 'border-[#f97316] text-white'
                      : 'border-transparent text-[#9ca3af] hover:text-white hover:border-white/20'
                  }`}
                >
                  {tab.label}
                </a>
              ))}
            </div>

            {/* Tab content with fade transition */}
            <div className="pt-4">
              {activeTab === 'servicos' && (
                <ServicesList
                  services={services}
                  loading={loadingServices}
                  onBook={(svc) => openModal({ service: svc })}
                  error={servicesError}
                  onRetry={loadData}
                />
              )}
              {activeTab === 'profissionais' && (
                <ProfessionalsGrid
                  professionals={professionals}
                  loading={loadingProfessionals}
                  onBook={(pro) => { openModal({ professional: pro }); setActiveTab('servicos') }}
                />
              )}
              {activeTab === 'avaliacoes' && <ReviewsList />}
            </div>
          </div>

          {/* Right column: sidebar */}
          <aside className="lg:w-72 xl:w-80 shrink-0">
            <Sidebar />
          </aside>
        </div>
      </main>

      <Footer />

      {/* Mobile fixed CTA bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 px-4 pb-4 pt-3 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/90 to-transparent">
        <button
          onClick={() => openModal()}
          className="w-full bg-[#f97316] hover:bg-[#ea6c00] text-white font-bold py-4 rounded-xl text-base shadow-xl shadow-[#f97316]/20 transition-all duration-150 active:scale-[0.98]"
        >
          Agendar Agora →
        </button>
      </div>

      {/* Booking modal */}
      <BookingModal
        isOpen={modal.open}
        onClose={closeModal}
        services={services}
        professionals={professionals}
        initialService={modal.service}
        initialProfessional={modal.professional}
      />
    </div>
  )
}
