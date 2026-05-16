import { apiClient } from './client'

export interface LoginPayload {
  username: string
  password: string
}

export interface ApiUser {
  id: string
  username: string
  email: string
  name: string
  role: string
  branchId?: string
  organizationId?: string
  teacherId?: string
  studentId?: string
}

export interface LoginResult {
  user: ApiUser
  accessToken: string
  refreshToken: string
}

// API авторизации
export const authApi = {
  login: (payload: LoginPayload) =>
    apiClient.post<LoginResult>('/auth/login', payload),

  me: () => apiClient.get<ApiUser>('/auth/me'),
}
