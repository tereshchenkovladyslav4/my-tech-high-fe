import { DropDownItem } from '@mth/components/DropDown/types'
import { CourseType } from '@mth/enums'

export const COURSE_TYPE_ITEMS: DropDownItem[] = [
  { label: 'Custom-built', value: CourseType.CUSTOM_BUILT },
  { label: 'My Tech High Direct', value: CourseType.MTH_DIRECT },
  { label: '3rd Party Provider', value: CourseType.THIRD_PARTY_PROVIDER },
]
