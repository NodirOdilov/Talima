import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { GraduationCap, Award } from 'lucide-react'
import { apiClient } from '@/core/api/client'

interface StudentRow {
  id: string
  fullName: string
  email?: string
  phone?: string
  points?: number
  monthlyFee?: number
  group?: { name?: string }
  isActive?: boolean
}

export default function ParentChild() {
  const { t } = useTranslation()
  const [child, setChild] = useState<StudentRow | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient.get<StudentRow[]>('/academics/students').then((r) => {
      if (r.success && Array.isArray(r.data) && r.data.length > 0) {
        setChild(r.data[0])
      }
      setLoading(false)
    })
  }, [])

  if (loading) {
    return <p className="text-muted-foreground text-center py-12">{t('common.loading')}</p>
  }

  if (!child) {
    return <p className="text-muted-foreground text-center py-12">Нет данных об ученике</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <GraduationCap className="w-8 h-8 text-indigo-600" />
        <h1 className="text-2xl font-bold">{t('common.myChild')}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{child.fullName}</CardTitle>
          <CardDescription>{child.group?.name ?? '—'}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4 text-sm">
            <span>{child.email}</span>
            <span>{child.phone}</span>
            <Badge variant={child.isActive ? 'default' : 'secondary'}>
              {child.isActive ? t('status.active') : t('status.inactive')}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span className="font-bold">{child.points ?? 0}</span>
            <span className="text-muted-foreground">{t('student.points')}</span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              {t('student.monthlyTuitionFee')}: {(child.monthlyFee ?? 0).toLocaleString()} сум
            </p>
            <Progress value={Math.min(100, (child.points ?? 0) / 5)} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
