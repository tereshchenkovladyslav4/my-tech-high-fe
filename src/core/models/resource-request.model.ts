import { ResourceRequestStatus } from '@mth/enums'
import { HomeroomResource, ResourceLevel } from './homeroom-resource.model'
import { ResourceRequestEmail } from './resource-request-email.model'
import { Student } from './student.model'

export type ResourceRequest = {
  id: number
  student_id: number
  resource_id: number
  resource_level_id: number
  status: ResourceRequestStatus
  created_at: string
  updated_at: number
  Student: Student
  Resource: HomeroomResource

  ResourceLevel: ResourceLevel
  ResourceRequestEmails: ResourceRequestEmail[]
}
