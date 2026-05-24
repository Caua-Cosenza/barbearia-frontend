import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export function AdminLogin() {
  const { login, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/admin/dashboard', { replace: true })
    }
  }, [isAuthenticated, isLoading, navigate])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (submitting) return
    setError(null)
    setSubmitting(true)
    try {
      await login(email, password)
      navigate('/admin/dashboard', { replace: true })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Credenciais inválidas')
    } finally {
      setSubmitting(false)
    }
  }

  if (isLoading) return null

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo / title */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#f97316] rounded-xl mx-auto mb-4 flex items-center justify-center">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Painel Admin</h1>
          <p className="text-[#9ca3af] text-sm mt-1">Barbearia</p>
        </div>

        {/* Form card */}
        <div className="bg-[#1a1a2e] rounded-2xl p-6 border border-white/5">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#9ca3af] mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="admin@barbearia.com"
                className="w-full bg-[#0f0f0f] border border-white/10 rounded-lg px-3.5 py-2.5
                           text-white placeholder-[#374151] text-sm
                           focus:outline-none focus:border-[#2563eb] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#9ca3af] mb-1.5">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full bg-[#0f0f0f] border border-white/10 rounded-lg px-3.5 py-2.5
                           text-white placeholder-[#374151] text-sm
                           focus:outline-none focus:border-[#2563eb] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#2563eb] hover:bg-blue-600 disabled:opacity-50
                         disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg
                         text-sm transition-colors duration-150"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Entrando...
                </span>
              ) : (
                'Entrar'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[#374151] text-xs mt-6">
          Acesso restrito a administradores
        </p>
      </div>
    </div>
  )
}
