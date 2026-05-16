import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DollarSign } from 'lucide-react'
import { useApiList } from '@/core/api/useApiList'

interface PaymentRow {
  id: string
  amount: number
  month: string
  status: string
  student?: { fullName?: string }
  studentId?: string
}

export default function ParentPayments() {
  const { t } = useTranslation()
  const { items: payments, loading } = useApiList<PaymentRow>('/finance/payments')

  const totalPaid = payments
    .filter((p) => p.status === 'paid')
    .reduce((s, p) => s + (p.amount ?? 0), 0)
  const totalPending = payments
    .filter((p) => p.status === 'pending')
    .reduce((s, p) => s + (p.amount ?? 0), 0)

  const statusLabel: Record<string, string> = {
    paid: t('status.paid', 'Оплачен'),
    pending: t('status.pending', 'Ожидает'),
    overdue: t('status.overdue', 'Просрочен'),
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <DollarSign className="w-8 h-8 text-green-600" />
        <h1 className="text-2xl font-bold">{t('navigation.payments')}</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardDescription>Оплачено</CardDescription>
            <CardTitle className="text-green-600">{totalPaid.toLocaleString()} сум</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Ожидает</CardDescription>
            <CardTitle className="text-amber-600">{totalPending.toLocaleString()} сум</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>История платежей</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-center py-8">{t('common.loading')}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ученик</TableHead>
                  <TableHead>Месяц</TableHead>
                  <TableHead>Сумма</TableHead>
                  <TableHead>Статус</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.student?.fullName ?? p.studentId}</TableCell>
                    <TableCell>{p.month}</TableCell>
                    <TableCell>{p.amount?.toLocaleString()} сум</TableCell>
                    <TableCell>
                      <Badge variant={p.status === 'paid' ? 'default' : 'secondary'}>
                        {statusLabel[p.status] ?? p.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
