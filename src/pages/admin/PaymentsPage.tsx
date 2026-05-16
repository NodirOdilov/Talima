import { ResourceCrudPage } from '@/features/platform/components/ResourceCrudPage'
import { paymentsConfig } from '@/features/admin/modules/resourceConfigs'

export default function PaymentsPage() {
  return <ResourceCrudPage config={paymentsConfig} />
}
