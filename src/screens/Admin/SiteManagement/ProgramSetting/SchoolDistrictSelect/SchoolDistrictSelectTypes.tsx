export type SchoolDistrictFileType = {
  name: string
  path: string
  file: File | undefined
}

export type SchoolDistrictSelectProps = {
  schoolDistrict: SchoolDistrictFileType | null
  setSchoolDistrict: (value: unknown) => void
  setSchoolDistrictArray: (value: unknown) => void
  setIsChanged: (value: boolean) => void
  setIsDelete: (value: unknown) => void
  isDelete: unknown
}
