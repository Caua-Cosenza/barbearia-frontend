import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import { api } from '../api/endpoints'
import type { AuthContextValue } from '../types'

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  // Start loading=true so PrivateRoute doesn't flash the login page before
  // the health check resolves (the HttpOnly cookie cannot be read by JS).
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    api.admin
      .health()
      .then((res) => setIsAuthenticated(res.success))
      .catch(() => setIsAuthenticated(false))
      .finally(() => setIsLoading(false))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.admin.login(email, password)
    if (!res.success) {
      throw new Error(res.message ?? 'Login falhou')
    }
    setIsAuthenticated(true)
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.admin.logout()
    } finally {
      setIsAuthenticated(false)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  return ctx
}
