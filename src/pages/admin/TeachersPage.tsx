import { ResourceCrudPage } from '@/features/platform/components/ResourceCrudPage'
import { teachersConfig } from '@/features/admin/modules/resourceConfigs'

export default function TeachersPage() {
  return <ResourceCrudPage config={teachersConfig} />
}
