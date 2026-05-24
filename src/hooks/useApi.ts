import { useState, useCallback } from 'react'
import type { ApiResponse } from '../types'

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useApi<T>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = useCallback(async (fn: () => Promise<ApiResponse<T>>) => {
    setState({ data: null, loading: true, error: null })
    try {
      const result = await fn()
      if (result.success) {
        setState({ data: result.data, loading: false, error: null })
      } else {
        setState({ data: null, loading: false, error: result.message })
      }
      return result
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Unexpected error'
      setState({ data: null, loading: false, error: message })
      return null
    }
  }, [])

  return { ...state, execute }
}
