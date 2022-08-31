export type SchoolDistrictFileType = {
  name: string
  path: string
  file: File | undefined
}

export type SchoolDistrictSelectProps = {
  schoolDistrict: SchoolDistrictFileType | null
  setSchoolDistrict: (value: SchoolDistrictFileType) => void
  setSchoolDistrictArray: (value: SchoolDistrictFileType[]) => void
  setIsChanged: (value: boolean) => void
  setIsDelete: (value: boolean) => void
  isDelete: boolean
}
