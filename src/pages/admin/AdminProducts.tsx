import { ResourceCrudPage } from '@/features/platform/components/ResourceCrudPage'
import { productsConfig } from '@/features/admin/modules/resourceConfigs'

export default function AdminProducts() {
  return <ResourceCrudPage config={productsConfig} />
}
