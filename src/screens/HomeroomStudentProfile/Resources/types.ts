export enum EventType {
  HIDE = 'hide',
  UNHIDE = 'unhide',
  ADD_CART = 'addCart',
  LOGIN = 'unhide',
  CLICK = 'click',
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
  inCart: boolean
  HiddenByStudent: boolean
  requested: boolean
  accepted: boolean
  requestable: boolean
  // Temp field
  background?: string
}

export interface ResourceCardProps {
  item: Resource
  onAction?: (evtType: EventType) => void
}

export interface ResourceCartBarProps {
  resourcesInCart: Resource[]
}

export interface ResourceModalProps {
  showHideModal: boolean
  setShowHideModal: (value: boolean) => void
  handleChangeResourceStatus: (eventType: EventType) => void
}
