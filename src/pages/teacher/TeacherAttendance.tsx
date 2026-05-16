import { ResourceCrudPage } from '@/features/platform/components/ResourceCrudPage'
import { attendanceConfig } from '@/features/admin/modules/resourceConfigs'

export default function TeacherAttendance() {
  return <ResourceCrudPage config={attendanceConfig} />
}
