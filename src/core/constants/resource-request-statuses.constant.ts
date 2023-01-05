import { DropDownItem } from '@mth/components/DropDown/types'
import { ResourceRequestStatus } from '@mth/enums'

export const RESOURCE_REQUEST_STATUS_ITEMS: DropDownItem[] = [
  { label: 'Requested', value: ResourceRequestStatus.REQUESTED },
  { label: 'Accepted', value: ResourceRequestStatus.ACCEPTED },
  { label: 'Removed', value: ResourceRequestStatus.REMOVED },
  { label: 'Waitlist', value: ResourceRequestStatus.WAITLIST },
]
