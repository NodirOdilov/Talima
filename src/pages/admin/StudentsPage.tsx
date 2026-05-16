import { ResourceCrudPage } from '@/features/platform/components/ResourceCrudPage'
import { studentsConfig } from '@/features/admin/modules/resourceConfigs'

export default function StudentsPage() {
  return <ResourceCrudPage config={studentsConfig} />
}
