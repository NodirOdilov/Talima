import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useApiList } from '@/core/api/useApiList'
import { useAcademicProfile } from '@/core/api/useAcademicProfile'
import { apiClient } from '@/core/api/client'
import { ShoppingCart, Award, Package } from 'lucide-react'

interface ProductRow {
  id: string
  name: string
  description?: string
  price: number
  category?: string
  stock?: number
}

export default function StudentShop() {
  const { t } = useTranslation()
  const { items: products, loading, reload } = useApiList<ProductRow>('/gamification/products')
  const { studentId, points, loading: profileLoading, student } = useAcademicProfile()
  const [purchasing, setPurchasing] = useState<string | null>(null)
  const [balance, setBalance] = useState(points)

  useEffect(() => { setBalance(points) }, [points])

  const handlePurchase = async (product: ProductRow) => {
    if (!studentId) {
      alert('Профиль ученика не найден')
      return
    }
    if (balance < product.price) {
      alert(t('student.notEnoughPoints'))
      return
    }
    setPurchasing(product.id)
    const res = await apiClient.post('/gamification/purchases', {
      student: studentId,
      product: product.id,
      price: product.price,
    })
    setPurchasing(null)
    if (res.success) {
      setBalance((p) => p - product.price)
      reload()
      alert(`${t('student.successfullyPurchased')} ${product.name}!`)
    } else {
      alert(res.error ?? 'Ошибка покупки')
    }
  }

  const displayPoints = balance || student?.points || 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShoppingCart className="w-7 h-7" />
            {t('navigation.shop')}
          </h1>
          <p className="text-muted-foreground">{t('student.spendEarnedPoints')}</p>
        </div>
        <Card className="px-4 py-2">
          <div className="flex items-center gap-2 text-amber-600 font-bold text-lg">
            <Award className="w-5 h-5" />
            {profileLoading ? '...' : displayPoints} {t('student.points')}
          </div>
        </Card>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-center py-12">{t('common.loading')}</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  {product.name}
                </CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <span className="font-bold text-amber-600">{product.price} {t('student.points')}</span>
                <Button
                  size="sm"
                  disabled={purchasing === product.id || displayPoints < product.price}
                  onClick={() => handlePurchase(product)}
                >
                  {purchasing === product.id ? t('student.purchasing') : t('student.buy')}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
