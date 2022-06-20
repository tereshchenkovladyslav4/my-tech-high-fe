import { SchoolYearItem } from '../types'

export type PageContentProps = {
  schoolYearItem: SchoolYearItem | undefined
  setSchoolYearItem: (value: SchoolYearItem | undefined) => void
  applicationItem: SchoolYearItem | undefined
  setApplicationItem: (value: SchoolYearItem | undefined) => void
  midYearItem: SchoolYearItem | undefined
  setMidYearItem: (value: SchoolYearItem | undefined) => void
  setIsChanged: (value: boolean) => void
}
