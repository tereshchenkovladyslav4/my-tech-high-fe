import { ResourceRequestStatus } from '@mth/enums'

export enum EventType {
  HIDE = 'hide',
  UNHIDE = 'unhide',
  ADD_CART = 'addCart',
  LOGIN = 'unhide',
  CLICK = 'click',
  DETAILS = 'details',
}

export enum ResourcePage {
  ROOT = 'root',
  REQUEST = 'request',
  DETAILS = 'details',
}

export type Resource = {
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
  resource_level: string
  family_resource: boolean
  priority: number
  is_active: boolean
  allow_request: boolean
  CartDate: Date
  HiddenByStudent: boolean
  RequestStatus: ResourceRequestStatus
  accepted: boolean
  requestable: boolean
  // Temp field
  background?: string
}

export interface ResourceCardProps {
  item: Resource
  page?: ResourcePage
  onAction?: (evtType: EventType) => void
}

export interface ResourceCartBarProps {
  resourcesInCart: Resource[]
  setPage: (value: ResourcePage) => void
}

export interface ResourceRequestProps {
  currentStudentId: number
  resourcesInCart: Resource[]
  setPage: (value: ResourcePage) => void
  handleChangeResourceStatus: (resource: Resource, eventType: EventType) => void
  refetch: () => void
  goToDetails: (item: Resource) => void
}

export interface ResourceConfirmProps {
  totalPrice: number
  onConfirm: () => void
  onCancel: () => void
}

export interface ResourceModalProps {
  showHideModal: boolean
  setShowHideModal: (value: boolean) => void
  handleChangeResourceStatus: (eventType: EventType) => void
}

export interface ResourceDetailsProps {
  item: Resource
  handleBack: () => void
}
