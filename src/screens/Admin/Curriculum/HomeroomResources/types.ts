import { CartEventType } from '@mth/enums'
import { HomeroomResource, SchoolYear } from '@mth/models'

export enum HomeroomResourcePage {
  ROOT = 'root',
  EDIT = 'edit',
  CONFIRMATION_DETAILS = 'confirmation-details',
  DETAIL = 'detail',
}

export type ConfirmationDetails = {
  details?: string
}
export interface HomeroomResourceCardProps {
  item: HomeroomResource
  action: boolean
  isPast: boolean
  setPage: (value: HomeroomResourcePage) => void
  onAction?: (evtType: CartEventType) => void
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
  handleChangeResourceStatus: (eventType: CartEventType) => void
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
