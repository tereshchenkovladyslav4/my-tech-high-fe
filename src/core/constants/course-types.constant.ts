import { DropDownItem } from '@mth/components/DropDown/types'
import { CourseType, MthTitle } from '@mth/enums'

export const COURSE_TYPE_ITEMS: DropDownItem[] = [
  { label: MthTitle.CUSTOM_BUILT, value: CourseType.CUSTOM_BUILT },
  { label: MthTitle.MY_TECH_HIGH_DIRECT, value: CourseType.MTH_DIRECT },
  { label: MthTitle.THIRD_PARTY_PROVIDER, value: CourseType.THIRD_PARTY_PROVIDER },
]
