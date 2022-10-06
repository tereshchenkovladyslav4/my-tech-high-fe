import { SchoolYearItem } from '../types'

export type PageContentProps = {
  enableSchedule: boolean
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
  setIsChanged: (value: boolean) => void
}
