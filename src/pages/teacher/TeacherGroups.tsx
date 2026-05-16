import { ResourceCrudPage } from '@/features/platform/components/ResourceCrudPage'
import { groupsConfig } from '@/features/admin/modules/resourceConfigs'

export default function TeacherGroups() {
  return <ResourceCrudPage config={groupsConfig} />
}
