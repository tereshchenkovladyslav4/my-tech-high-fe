export enum HOMEROOME_RESOURCE_TYPE {
  WITHDRAWAL = 0,
  WEBSITE_LINK,
  FORM,
  PDF_TO_SIGN,
}

export enum EventType {
  ADD = 'add',
  ALLOWREQUEST = 'allow_request',
  ARCHIVE = 'archive',
  CLICK = 'click',
  DELETE = 'delete',
  DUPLICATE = 'duplicate',
  EDIT = 'edit',
  RESTORE = 'restore',
}

export interface HomeroomeResource {
  id: number
  region_id: number
  title: string
  show_cost: boolean
  cost: number
  image_url: string
  type: HOMEROOME_RESOURCE_TYPE
  sequence: number
  website: string
  hidden: boolean
  allow_request?: boolean
}

export interface HomeroomeResourceProps {
  item: HomeroomeResource
  action: boolean
  onAction?: (evtType: EventType) => void
}
