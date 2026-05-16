import { ResourceCrudPage } from '@/features/platform/components/ResourceCrudPage'
import { messagesConfig } from '@/features/admin/modules/resourceConfigs'

export default function TeacherMessages() {
  return <ResourceCrudPage config={messagesConfig} />
}
