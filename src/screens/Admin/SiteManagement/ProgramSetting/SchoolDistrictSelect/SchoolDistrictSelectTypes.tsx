import { FileDeleted, ProgramSettingChanged } from '../types'

export type SchoolDistrictFileType = {
  name: string
  path: string
  file: File | undefined | null
}

export type SchoolDistrictArrayItem = { school_district_name: string; school_district_code: string }

export type SchoolDistrictSelectProps = {
  schoolDistrict: SchoolDistrictFileType | null
  setSchoolDistrict: (value: SchoolDistrictFileType) => void
  setSchoolDistrictArray: (value: SchoolDistrictArrayItem[]) => void
  setIsChanged: (value: ProgramSettingChanged) => void
  setIsDelete: (value: FileDeleted) => void
  isDelete: FileDeleted
  isChanged?: ProgramSettingChanged
}
