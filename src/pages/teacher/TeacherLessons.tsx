import { ResourceCrudPage } from '@/features/platform/components/ResourceCrudPage'
import { lessonsConfig } from '@/features/admin/modules/resourceConfigs'

export default function TeacherLessons() {
  return <ResourceCrudPage config={lessonsConfig} />
}
