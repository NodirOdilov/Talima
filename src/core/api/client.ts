import { env } from '../config/env'

export interface ApiResult<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  meta?: Record<string, unknown>
}

// HTTP клиент для Talima Django API
class ApiClient {
  private baseUrl = env.apiUrl
  private token: string | null = null

  setToken(token: string | null) {
    this.token = token
    if (token) localStorage.setItem('talima-token', token)
    else localStorage.removeItem('talima-token')
  }

  getToken(): string | null {
    if (this.token) return this.token
    return localStorage.getItem('talima-token')
  }

  async request<T>(path: string, options: RequestInit = {}): Promise<ApiResult<T>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }
    const token = this.getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`

    try {
      const res = await fetch(`${this.baseUrl}${path}`, { ...options, headers })
      const text = await res.text()
      let json: Record<string, unknown> = {}
      try {
        json = text ? JSON.parse(text) : {}
      } catch {
        return { success: false, error: 'Некорректный ответ сервера' }
      }
      if (!res.ok) {
        const err =
          (json.error as string) ??
          (json.detail as string) ??
          'Ошибка запроса'
        return { success: false, error: String(err) }
      }
      return json as unknown as ApiResult<T>
    } catch {
      return { success: false, error: 'Сервер недоступен' }
    }
  }

  get<T>(path: string) {
    return this.request<T>(path)
  }

  post<T>(path: string, body: unknown) {
    return this.request<T>(path, { method: 'POST', body: JSON.stringify(body) })
  }

  put<T>(path: string, body: unknown) {
    return this.request<T>(path, { method: 'PUT', body: JSON.stringify(body) })
  }

  patch<T>(path: string, body: unknown) {
    return this.request<T>(path, { method: 'PATCH', body: JSON.stringify(body) })
  }

  delete<T>(path: string) {
    return this.request<T>(path, { method: 'DELETE' })
  }
}

export const apiClient = new ApiClient()
