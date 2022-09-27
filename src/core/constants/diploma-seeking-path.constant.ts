import { DropDownItem } from '@mth/components/DropDown/types'
import { DiplomaSeekingPath } from '@mth/enums'

export const DIPLOMA_SEEKING_PATH_ITEMS: DropDownItem[] = [
  { label: 'Available for Both', value: DiplomaSeekingPath.BOTH },
  { label: 'Diploma-seeking Only', value: DiplomaSeekingPath.DIPLOMA_SEEKING },
  { label: 'Non Diploma-seeking Only', value: DiplomaSeekingPath.NON_DIPLOMA_SEEKING },
]
