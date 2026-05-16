import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Award, BookOpen, ShoppingCart } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useAcademicProfile } from '@/core/api/useAcademicProfile'
import { apiClient } from '@/core/api/client'

export default function StudentDashboard() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const { student, points, loading } = useAcademicProfile()
  const [lessonsCount, setLessonsCount] = useState(0)

  useEffect(() => {
    if (!student?.groupId) return
    apiClient.get<unknown[]>(`/academics/lessons?group=${student.groupId}`).then((r) => {
      if (r.success && Array.isArray(r.data)) setLessonsCount(r.data.length)
    })
  }, [student?.groupId])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="md:col-span-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100">
              {t('student.welcomeBack')} {user?.name}!
            </CardTitle>
            <CardDescription>{t('student.progressOverview')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-600">{loading ? '...' : points}</div>
            <p className="text-sm text-muted-foreground mt-1">{t('student.availablePoints')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">{t('navigation.lessons')}</CardTitle>
            <BookOpen className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lessonsCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">{t('navigation.shop')}</CardTitle>
            <ShoppingCart className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-1">
              <Award className="w-5 h-5 text-amber-500" />
              {student?.fullName ?? user?.name}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
