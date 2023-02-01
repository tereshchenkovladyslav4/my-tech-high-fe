import { ResourceRequestStatus, UsernameFormat } from '@mth/enums'

export type ResourceLevel = {
  resource_level_id: number
  limit: number | null
  name: string
  TotalRequests?: number
}

export type HomeroomResource = {
  resource_id?: number
  SchoolYearId: number
  title: string
  image: string
  subtitle: string
  price: number
  website: string
  grades: string
  resource_limit?: number | null
  std_username_format?: UsernameFormat
  std_user_name: string
  std_password: string
  detail: string
  add_resource_level: boolean
  ResourceLevels: ResourceLevel[]
  family_resource: boolean
  priority: number
  is_active: boolean
  allow_request: boolean
  software_reimbursement: boolean
  // Temp field
  file?: File
  CartDate: Date
  TotalRequests: number
  WaitListConfirmed: boolean
  ResourceLevelId?: number
  HiddenByStudent: boolean
  RequestStatus: ResourceRequestStatus
  // Temp field
  background?: string
}
