import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authApi } from '@/core/api/auth.api'
import { apiClient } from '@/core/api/client'

export type UserRole =
  | 'superadmin'
  | 'admin'
  | 'director'
  | 'accountant'
  | 'hr_manager'
  | 'teacher'
  | 'student'
  | 'parent'

export interface User {
  id: string
  username: string
  name: string
  role: UserRole
  email: string
  branchId?: string
  organizationId?: string
  teacherId?: string
  studentId?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  accessToken: string | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  restoreSession: () => Promise<void>
}

// Резервные mock-пользователи (если API недоступен)
const mockUsers: User[] = [
  { id: '1', username: 'superadmin', name: 'Супер Админ', role: 'superadmin', email: 'super@talima.uz' },
  { id: '2', username: 'admin', name: 'Администратор', role: 'admin', email: 'admin@talima.uz' },
  { id: '3', username: 'director', name: 'Директор', role: 'director', email: 'director@talima.uz' },
  { id: '4', username: 'accountant', name: 'Бухгалтер', role: 'accountant', email: 'accountant@talima.uz' },
  { id: '5', username: 'hr_manager', name: 'HR Менеджер', role: 'hr_manager', email: 'hr@talima.uz' },
  { id: '6', username: 'teacher1', name: 'Иван Преподаватель', role: 'teacher', email: 'teacher1@talima.uz' },
  { id: '7', username: 'student1', name: 'Алиса Ученик', role: 'student', email: 'student1@talima.uz' },
  { id: '8', username: 'parent1', name: 'Сара Родитель', role: 'parent', email: 'parent1@talima.uz' },
  { id: '9', username: 'teacher2', name: 'Мария Преподаватель', role: 'teacher', email: 'teacher2@talima.uz' },
  { id: '10', username: 'student2', name: 'Боб Ученик', role: 'student', email: 'student2@talima.uz' },
]

const DEMO_PASSWORD = 'talima2026'

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      accessToken: null,

      login: async (username: string, password: string) => {
        // Попытка входа через API
        const apiResult = await authApi.login({ username, password })
        if (apiResult.success && apiResult.data) {
          const { user, accessToken } = apiResult.data
          apiClient.setToken(accessToken)
          set({
            user: {
              id: user.id,
              username: user.username,
              name: user.name,
              role: user.role as UserRole,
              email: user.email,
              branchId: user.branchId,
              organizationId: user.organizationId,
              teacherId: user.teacherId,
              studentId: user.studentId,
            },
            isAuthenticated: true,
            accessToken,
          })
          return true
        }

        // Fallback: локальная mock-авторизация
        const user = mockUsers.find((u) => u.username === username)
        if (user && password === DEMO_PASSWORD) {
          set({ user, isAuthenticated: true, accessToken: null })
          return true
        }
        return false
      },

      logout: () => {
        apiClient.setToken(null)
        set({ user: null, isAuthenticated: false, accessToken: null })
      },

      restoreSession: async () => {
        const token = apiClient.getToken()
        if (!token) return
        const result = await authApi.me()
        if (result.success && result.data) {
          const user = result.data
          set({
            user: {
              id: user.id,
              username: user.username,
              name: user.name,
              role: user.role as UserRole,
              email: user.email,
              branchId: user.branchId,
              organizationId: user.organizationId,
              teacherId: user.teacherId,
              studentId: user.studentId,
            },
            isAuthenticated: true,
            accessToken: token,
          })
        } else {
          get().logout()
        }
      },
    }),
    { name: 'auth-storage' }
  )
)
