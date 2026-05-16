import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { apiClient } from '@/core/api/client'
import { useAcademicProfile } from '@/core/api/useAcademicProfile'

export default function TeacherStatistics() {
  const { t } = useTranslation()
  const { teacherId } = useAcademicProfile()
  const [groups, setGroups] = useState<{ name: string; maxStudents: number }[]>([])

  useEffect(() => {
    const q = teacherId ? `?teacher=${teacherId}` : ''
    apiClient.get<{ name: string; maxStudents: number }[]>(`/academics/groups${q}`).then((r) => {
      if (r.success && Array.isArray(r.data)) setGroups(r.data)
    })
  }, [teacherId])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('navigation.statistics')}</h1>
      <Card>
        <CardHeader>
          <CardTitle>Группы преподавателя</CardTitle>
        </CardHeader>
        <CardContent>
          {groups.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={groups}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="maxStudents" fill="#6366f1" name="Макс. учеников" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-center py-8">{t('common.loading')}</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
