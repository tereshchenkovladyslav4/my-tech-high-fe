import { DropDownItem } from '@mth/components/DropDown/types'
import { PacketStatus } from '../enums/packet-status.enum'

export const PACKET_STATUS_OPTIONS: DropDownItem[] = [
  {
    label: 'Not Started',
    value: PacketStatus.NOT_STARTED,
  },
  {
    label: 'Started',
    value: PacketStatus.STARTED,
  },
  {
    label: 'Missing Info',
    value: PacketStatus.MISSING_INFO,
  },
  {
    label: 'Submitted',
    value: PacketStatus.SUBMITTED,
  },
  {
    label: 'Resubmitted',
    value: PacketStatus.RESUBMITTED,
  },
  {
    label: 'Age Issue',
    value: PacketStatus.AGE_ISSUE,
  },
  {
    label: 'Conditional',
    value: PacketStatus.CONDITIONAL,
  },
  {
    label: 'Accepted',
    value: PacketStatus.ACCEPTED,
  },
]
