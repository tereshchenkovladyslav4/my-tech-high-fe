import { SchoolYear } from '@mth/models'

export enum EventType {
  ADD = 'add',
  ALLOW_REQUEST = 'allowRequest',
  DISALLOW_REQUEST = 'disallowRequest',
  ARCHIVE = 'archive',
  CLICK = 'click',
  DELETE = 'delete',
  DUPLICATE = 'duplicate',
  EDIT = 'edit',
  RESTORE = 'restore',
}

export enum HomeroomResourcePage {
  ROOT = 'root',
  EDIT = 'edit',
  CONFIRMATION_DETAILS = 'confirmation-details',
}

export type ResourceLevel = {
  resource_level_id: number
  limit: number | null
  name: string
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
  background?: string
}

export type ConfirmationDetails = {
  details?: string
}
export interface HomeroomResourceCardProps {
  item: HomeroomResource
  action: boolean
  isPast: boolean
  setPage: (value: HomeroomResourcePage) => void
  onAction?: (evtType: EventType) => void
}

export interface HomeroomResourceModalProps {
  showArchivedModal: boolean
  showUnarchivedModal: boolean
  showAllowModal: boolean
  showDisallowModal: boolean
  showDeleteModal: boolean
  showCloneModal: boolean
  setShowArchivedModal: (value: boolean) => void
  setShowUnarchivedModal: (value: boolean) => void
  setShowAllowModal: (value: boolean) => void
  setShowDisallowModal: (value: boolean) => void
  setShowDeleteModal: (value: boolean) => void
  setShowCloneModal: (value: boolean) => void
  handleChangeResourceStatus: (eventType: EventType) => void
}

export interface HomeroomResourceEditProps {
  schoolYearId: number
  schoolYearData: SchoolYear | undefined
  item: HomeroomResource | undefined
  stateName: string
  setPage: (value: HomeroomResourcePage) => void
  refetch: () => void
}

export type HeaderComponentProps = {
  title: string
  isSubmitted: boolean
  handleBack: () => void
  handleCancel: () => void
}

export type HomeroomResourceFormProps = {
  schoolYearId: number
  setIsChanged: (value: boolean) => void
}

export type ConfirmationDetailsProps = {
  setPage: (value: HomeroomResourcePage) => void
}

export type ConfirmationDetailsFormProps = {
  setIsChanged: (value: boolean) => void
}
