import { RESOURCE_REQUEST_STATUS_ITEMS } from '@mth/constants'
import { ResourceRequestStatus } from '@mth/enums'

export const resourceRequestStatus = (status: ResourceRequestStatus): string => {
  return RESOURCE_REQUEST_STATUS_ITEMS.find((x) => x.value === status)?.label || status.toString()
}
