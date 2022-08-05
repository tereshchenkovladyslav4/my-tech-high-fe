export enum EventType {
  ADD = 'add',
  ALLOW_REQUEST = 'allowRequest',
  ARCHIVE = 'archive',
  CLICK = 'click',
  DELETE = 'delete',
  DUPLICATE = 'duplicate',
  EDIT = 'edit',
  RESTORE = 'restore',
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
  resource_level: string
  family_resource: boolean
  priority: number
  is_active: boolean
  // Temp field
  file?: File
  background?: string
}

export interface HomeroomResourceProps {
  backAction?: () => void
}

export interface HomeroomResourceCardProps {
  item: HomeroomResource
  action: boolean
  isPast: boolean
  setPage: (value: string) => void
  onAction?: (evtType: EventType) => void
}

export interface HomeroomResourceEditProps {
  schoolYearId: number
  item: HomeroomResource | undefined
  stateName: string
  setPage: (value: string) => void
  refetch: () => void
}

export type HeaderComponentProps = {
  title: string
  isSubmitted: boolean
  handleBack: () => void
  setShowCancelModal: (value: boolean) => void
}

export type HomeroomResourceFormProps = {
  setIsChanged: (value: boolean) => void
}
