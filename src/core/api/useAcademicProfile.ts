import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { apiClient } from './client'

interface StudentRow {
  id: string
  fullName?: string
  points?: number
  groupId?: string
  email?: string
}

/** Профиль ученика/преподавателя текущего пользователя */
export function useAcademicProfile() {
  const { user } = useAuthStore()
  const [studentId, setStudentId] = useState<string | null>(user?.studentId ?? null)
  const [teacherId, setTeacherId] = useState<string | null>(user?.teacherId ?? null)
  const [student, setStudent] = useState<StudentRow | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      const me = await apiClient.get<{
        studentId?: string
        teacherId?: string
        email?: string
        name?: string
      }>('/auth/me')
      if (cancelled) return

      const sid = me.data?.studentId ?? user?.studentId ?? null
      const tid = me.data?.teacherId ?? user?.teacherId ?? null
      setStudentId(sid)
      setTeacherId(tid)

      if (sid) {
        const res = await apiClient.get<StudentRow>(`/academics/students/${sid}`)
        if (!cancelled && res.success && res.data) setStudent(res.data)
      } else if (user?.role === 'student') {
        const list = await apiClient.get<StudentRow[]>('/academics/students')
        if (!cancelled && list.success && Array.isArray(list.data)) {
          const found = list.data.find(
            (s) => s.email === user.email || s.fullName === user.name
          )
          if (found) {
            setStudent(found)
            setStudentId(found.id)
          }
        }
      }
      setLoading(false)
    }
    if (user) load()
    else setLoading(false)
    return () => { cancelled = true }
  }, [user?.id, user?.email, user?.name, user?.role, user?.studentId, user?.teacherId])

  return { studentId, teacherId, student, loading, points: student?.points ?? 0 }
}
