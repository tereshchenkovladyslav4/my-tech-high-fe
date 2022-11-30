import { SchoolYear } from '@mth/models'
import { SchoolYearItem } from '../types'

export type PageContentProps = {
  enableSchedule: boolean
  schoolYear: SchoolYear | undefined
  schoolYearItem: SchoolYearItem | undefined
  setSchoolYearItem: (value: SchoolYearItem | undefined) => void
  applicationItem: SchoolYearItem | undefined
  setApplicationItem: (value: SchoolYearItem | undefined) => void
  midYearItem: SchoolYearItem | undefined
  setMidYearItem: (value: SchoolYearItem | undefined) => void
  scheduleBuilderItem: SchoolYearItem | undefined
  setScheduleBuilderItem: (value: SchoolYearItem | undefined) => void
  secondSemesterItem: SchoolYearItem | undefined
  setSecondSemesterItem: (value: SchoolYearItem | undefined) => void
  midYearScheduleItem: SchoolYearItem | undefined
  setMidYearScheduleItem: (value: SchoolYearItem | undefined) => void
  homeroomResourceItem: SchoolYearItem | undefined
  setHomeroomResourceItem: (value: SchoolYearItem | undefined) => void
  directOrderItem: SchoolYearItem | undefined
  setDirectOrderItem: (value: SchoolYearItem | undefined) => void
  reimbursementItem: SchoolYearItem | undefined
  setReimbursementItem: (value: SchoolYearItem | undefined) => void
  customBuiltItem: SchoolYearItem | undefined
  setCustomBuiltItem: (value: SchoolYearItem | undefined) => void
  requireSoftwareItem: SchoolYearItem | undefined
  setRequireSoftwareItem: (value: SchoolYearItem | undefined) => void
  thirdPartyItem: SchoolYearItem | undefined
  setThirdPartyItem: (value: SchoolYearItem | undefined) => void
  midDirectOrderItem: SchoolYearItem | undefined
  setMidDirectOrderItem: (value: SchoolYearItem | undefined) => void
  midReimbursementItem: SchoolYearItem | undefined
  setMidReimbursementItem: (value: SchoolYearItem | undefined) => void
  midCustomBuiltItem: SchoolYearItem | undefined
  setMidCustomBuiltItem: (value: SchoolYearItem | undefined) => void
  midRequireSoftwareItem: SchoolYearItem | undefined
  setMidRequireSoftwareItem: (value: SchoolYearItem | undefined) => void
  midThirdPartyItem: SchoolYearItem | undefined
  setMidThirdPartyItem: (value: SchoolYearItem | undefined) => void
  setIsChanged: (value: boolean) => void
}
