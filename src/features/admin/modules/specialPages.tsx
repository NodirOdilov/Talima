import { useEffect, useState } from 'react'
import { LayoutDashboard, GitBranch, BarChart3, PieChart } from 'lucide-react'
import { apiClient } from '@/core/api/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

export function PlatformDashboard() {
  const [data, setData] = useState<Record<string, number> | null>(null)

  useEffect(() => {
    apiClient.get<Record<string, number>>('/analytics/dashboard').then((r) => {
      if (r.success && r.data) setData(r.data as Record<string, number>)
    })
  }, [])

  const stats = data ? [
    { label: 'Ученики', value: data.studentsCount ?? 0 },
    { label: 'Преподаватели', value: data.teachersCount ?? 0 },
    { label: 'Группы', value: data.groupsCount ?? 0 },
    { label: 'Выручка', value: `${(data.revenue ?? 0).toLocaleString()} сум` },
    { label: 'Лиды', value: data.leadsCount ?? 0 },
    { label: 'Курсы LMS', value: data.activeCourses ?? 0 },
  ] : []

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <LayoutDashboard className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Платформа Talima Enterprise</h1>
          <p className="text-muted-foreground">Django REST API — полный CRUD всех модулей</p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-2">
              <CardDescription>{s.label}</CardDescription>
              <CardTitle className="text-2xl">{s.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
      {!data && <p className="text-muted-foreground">Загрузка статистики...</p>}
    </div>
  )
}

export function CrmPipelinePage() {
  const [pipeline, setPipeline] = useState<{ status: string; count: number }[]>([])

  useEffect(() => {
    apiClient.get<{ status: string; count: number }[]>('/crm/pipeline').then((r) => {
      if (r.success && Array.isArray(r.data)) setPipeline(r.data)
    })
  }, [])

  const total = pipeline.reduce((s, p) => s + p.count, 0) || 1
  const labels: Record<string, string> = {
    new: 'Новый', contacted: 'Контакт', qualified: 'Квалифицирован',
    converted: 'Конвертирован', lost: 'Потерян',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <GitBranch className="w-10 h-10 text-indigo-600" />
        <div>
          <h1 className="text-2xl font-bold">Воронка продаж</h1>
          <p className="text-muted-foreground">Этапы конверсии лидов</p>
        </div>
      </div>
      <div className="grid gap-4">
        {pipeline.map((p) => (
          <Card key={p.status}>
            <CardContent className="pt-6">
              <div className="flex justify-between mb-2">
                <span className="font-medium">{labels[p.status] ?? p.status}</span>
                <Badge>{p.count}</Badge>
              </div>
              <Progress value={(p.count / total) * 100} className="h-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function FinanceSummaryPage() {
  const [summary, setSummary] = useState<Record<string, number> | null>(null)

  useEffect(() => {
    apiClient.get<Record<string, number>>('/finance/summary').then((r) => {
      if (r.success && r.data) setSummary(r.data)
    })
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <BarChart3 className="w-10 h-10 text-green-600" />
        <h1 className="text-2xl font-bold">Финансовая сводка</h1>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardDescription>Оплачено</CardDescription>
            <CardTitle className="text-green-600">{(summary?.totalPaid ?? 0).toLocaleString()} сум</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Ожидает</CardDescription>
            <CardTitle className="text-amber-600">{(summary?.totalPending ?? 0).toLocaleString()} сум</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Расходы</CardDescription>
            <CardTitle className="text-red-600">{(summary?.totalExpenses ?? 0).toLocaleString()} сум</CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}

export function AnalyticsDashboardPage() {
  return <PlatformDashboard />
}

export function AnalyticsReportsPage() {
  const [reports, setReports] = useState<unknown>(null)
  useEffect(() => {
    apiClient.get('/analytics/reports').then((r) => { if (r.success) setReports(r.data) })
  }, [])
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <PieChart className="w-8 h-8" />
        <h1 className="text-2xl font-bold">Отчёты</h1>
      </div>
      <Card>
        <CardContent className="pt-6">
          <pre className="text-xs overflow-auto max-h-96 bg-muted p-4 rounded">
            {JSON.stringify(reports, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}
