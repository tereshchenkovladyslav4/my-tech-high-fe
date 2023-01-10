import { ResourceSubtitle } from '@mth/enums'
import { ResourceRequest } from '../models/resource-request.model'

export const resourceRequestCost = (data: ResourceRequest): string => {
  const subtitle = data?.Resource?.subtitle
  const price = data?.Resource?.price
  return subtitle == ResourceSubtitle.PRICE ? `$${price}` : subtitle == ResourceSubtitle.INCLUDED ? 'Included' : 'Free'
}
