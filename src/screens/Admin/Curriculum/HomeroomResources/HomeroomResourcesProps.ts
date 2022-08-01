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

export interface HomeroomResource {
  resource_id: number
  region_id: number
  school_year_id: number
  title: string
  showCost?: boolean
  cost?: number
  image?: string
  sequence?: number
  website?: string
  allowRequest?: boolean
  hidden?: boolean
}

export interface HomeroomResourceProps {
  backAction?: () => void
}

export interface HomeroomResourceCardProps {
  item: HomeroomResource
  action: boolean
  isPast: boolean
  onAction?: (evtType: EventType) => void
}
