import { CartEventType } from '@mth/enums'
import { HomeroomResource } from '@mth/models'

export enum ResourcePage {
  ROOT = 'root',
  REQUEST = 'request',
  DETAILS = 'details',
}

export interface ResourceCardProps {
  item: HomeroomResource
  page?: ResourcePage
  onAction?: (evtType: CartEventType) => void
}

export interface ResourceCartBarProps {
  resourcesInCart: HomeroomResource[]
  handleChangeResourceStatus: (resource: HomeroomResource, eventType: CartEventType) => void
  setPage: (value: ResourcePage) => void
}

export interface ResourceRequestProps {
  currentStudentId: number
  resourcesInCart: HomeroomResource[]
  setPage: (value: ResourcePage) => void
  handleChangeResourceStatus: (resource: HomeroomResource, eventType: CartEventType) => void
  refetch: () => void
  goToDetails: (item: HomeroomResource) => void
}

export interface ResourceConfirmProps {
  totalPrice: number
  onConfirm: () => void
  onCancel: () => void
}

export interface ResourceModalProps {
  showHideModal: boolean
  setShowHideModal: (value: boolean) => void
  handleChangeResourceStatus: (eventType: CartEventType) => void
}

export interface WaitListModalProps {
  joinWaitlistResources: HomeroomResource[]
  handleChangeResourceStatus: (resource: HomeroomResource, eventType: CartEventType) => void
  isAllDone: () => void
}

export interface ResourceDetailsProps {
  item: HomeroomResource
  handleBack: () => void
  onCardAction: (evtType: CartEventType) => void
}
