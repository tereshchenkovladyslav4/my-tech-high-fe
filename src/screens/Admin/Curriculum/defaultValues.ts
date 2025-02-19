import { ResourceRequestStatus } from '@mth/enums'
import { HomeroomResource, ResourceLevel } from '@mth/models'

export const defaultHomeroomFormData: HomeroomResource = {
  resource_id: 0,
  SchoolYearId: 0,
  title: '',
  image: '',
  subtitle: '',
  price: 0,
  website: '',
  grades: '',
  std_user_name: '',
  std_password: '',
  detail: '',
  resource_limit: null,
  add_resource_level: false,
  ResourceLevels: [],
  family_resource: false,
  priority: 0,
  is_active: false,
  allow_request: false,
  software_reimbursement: false,
  CartDate: new Date(),
  TotalRequests: 0,
  WaitListConfirmed: false,
  HiddenByStudent: false,
  RequestStatus: ResourceRequestStatus.REQUESTED,
}

export const defaultResourceLevelFormData: ResourceLevel = {
  resource_level_id: 0,
  limit: null,
  name: '',
}
