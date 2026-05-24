import { useState, useEffect } from 'react'
import type { ApiResponse } from '../types'

export function useFetch<T>(fn: () => Promise<ApiResponse<T>>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fn()
      .then((res) => {
        if (cancelled) return
        if (res.success) setData(res.data)
        else setError(res.message)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Fetch failed')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, loading, error }
}
