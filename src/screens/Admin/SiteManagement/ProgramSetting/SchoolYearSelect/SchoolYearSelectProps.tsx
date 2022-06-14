import { CountyFileType } from '../CountySelect/CountySelectTypes'
import { SchoolDistrictFileType } from '../SchoolDistrictSelect/SchoolDistrictSelectTypes'

export type SchoolYearSelectProps = {
  setSelectedYearId: (value: string) => void
  setSpecialEd: (value: boolean) => void
  setEnroll: (value: boolean) => void
  setBirthDate: (value: string) => void
  setGrades: (value: string) => void
  selectedYearId: string
  setCounty: (value: CountyFileType) => void
  setSchoolDistrict: (value: SchoolDistrictFileType) => void
}
