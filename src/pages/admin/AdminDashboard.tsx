import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { Users, GraduationCap, DollarSign, TrendingUp } from 'lucide-react'
import { apiClient } from '@/core/api/client'

interface DashboardStats {
  studentsCount?: number
  teachersCount?: number
  groupsCount?: number
  revenue?: number
  leadsCount?: number
  activeCourses?: number
}

export default function AdminDashboard() {
  const { t } = useTranslation()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [teachers, setTeachers] = useState<{ name: string; subject: string; kpi: number }[]>([])

  useEffect(() => {
    apiClient.get<DashboardStats>('/analytics/dashboard').then((r) => {
      if (r.success && r.data) setStats(r.data)
    })
    apiClient.get<{ name: string; subject: string; kpi: number }[]>('/academics/teachers').then((r) => {
      if (r.success && Array.isArray(r.data)) setTeachers(r.data.slice(0, 6))
    })
  }, [])

  const userStats = [
    { name: 'students', value: stats?.studentsCount ?? 0, color: '#3B82F6' },
    { name: 'teachers', value: stats?.teachersCount ?? 0, color: '#10B981' },
    { name: 'groups', value: stats?.groupsCount ?? 0, color: '#F59E0B' },
  ].filter((s) => s.value > 0)

  const teacherPerformance = teachers.map((tch) => ({
    name: tch.name,
    kpi: tch.kpi ?? 0,
    subject: tch.subject,
  }))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.totalStudents')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.studentsCount ?? '—'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.totalTeachers')}</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.teachersCount ?? '—'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.monthlyRevenue')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats?.revenue ?? 0).toLocaleString()} сум
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.growthRate')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.leadsCount ?? 0} лидов</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.userDistribution')}</CardTitle>
            <CardDescription>{t('dashboard.userBreakdown')}</CardDescription>
          </CardHeader>
          <CardContent>
            {userStats.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={userStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${t(`dashboard.${name}`)} ${((percent || 0) * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    dataKey="value"
                  >
                    {userStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-center py-8">{t('common.loading')}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.teacherPerformance')}</CardTitle>
            <CardDescription>KPI преподавателей (API)</CardDescription>
          </CardHeader>
          <CardContent>
            {teacherPerformance.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={teacherPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="kpi" fill="#3B82F6" name="KPI" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-center py-8">{t('common.loading')}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
