import { ReduceFunds } from '@mth/enums'
import { CountyFileType } from '../CountySelect/CountySelectTypes'
import { SchoolDistrictFileType } from '../SchoolDistrictSelect/SchoolDistrictSelectTypes'
import { SchoolYears } from '../types'

export type SchoolYearSelectProps = {
  setSelectedYearId: (value: string) => void
  setSpecialEd: (value: boolean) => void
  setSpecialEdOptions: (value: Array<{ option_value: string }>) => void
  setEnroll: (value: boolean) => void
  setBirthDate: (value: string) => void
  setGrades: (value: string) => void
  selectedYearId: string
  setCounty: (value: CountyFileType) => void
  setSchoolDistrict: (value: SchoolDistrictFileType) => void
  schoolYears: SchoolYears[]
  setSchoolYears: (value: SchoolYears[]) => void
  setSchedule: (value: boolean) => void
  setDiplomaSeeking: (value: boolean) => void
  setTestingPreference: (value: boolean) => void
  setLearningLogs: (value: boolean | undefined) => void
  setLearningLogsFirstSecondSemesters: (value: boolean) => void
  setReimbursements: (value: ReduceFunds | undefined) => void
  setRequireSoftware: (value: boolean) => void
  setDirectOrders: (value: ReduceFunds | undefined) => void
}
