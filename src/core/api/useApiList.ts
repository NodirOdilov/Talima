import { useCallback, useEffect, useState } from 'react'
import { apiClient } from './client'

/** Загрузка списка из Django API */
export function useApiList<T = Record<string, unknown>>(endpoint: string) {
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    const res = await apiClient.get<T[]>(endpoint)
    if (res.success && Array.isArray(res.data)) {
      setItems(res.data)
    } else {
      setError(res.error ?? 'Ошибка загрузки')
      setItems([])
    }
    setLoading(false)
  }, [endpoint])

  useEffect(() => { reload() }, [reload])

  return { items, loading, error, reload }
}
